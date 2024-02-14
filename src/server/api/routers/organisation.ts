import {
  createTRPCRouter,
  organisationMemberProcedure,
  organisationModeratorProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  CreateOrganisation,
  JoinOrganisation,
  organisationIdSchema,
} from "@/server/types/organisationTypes";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import {
  type Organisation,
  type Prisma,
  type PrismaClient,
  type User,
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const organisationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateOrganisation)
    .mutation(async ({ ctx, input }) => {
      const adminRole = await ctx.db.role.create({
        data: {
          name: input.name + "-admin",
        },
      });

      const moderatorRole = await ctx.db.role.create({
        data: {
          name: input.name + "-moderator",
        },
      });

      const memberRole = await ctx.db.role.create({
        data: {
          name: input.name + "-member",
        },
      });

      const organisation = await ctx.db.organisation.create({
        data: {
          name: input.name,
          adminRoleId: adminRole.id,
          moderatorRoleId: moderatorRole.id,
          memberRoleId: memberRole.id,
        },
      });

      const userId = ctx.session.user.id;

      await ctx.db.userRoleLink.create({
        data: {
          userId: userId,
          roleId: adminRole.id,
        },
      });

      return organisation;
    }),

  join: protectedProcedure
    .input(JoinOrganisation)
    .mutation(async ({ ctx, input }) => {
      const organisation = await ctx.db.organisation.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!organisation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organisation not found",
        });

      const userId = ctx.session.user.id;

      await ctx.db.userRoleLink.create({
        data: {
          userId: userId,
          roleId: organisation.memberRoleId,
        },
      });

      return organisation;
    }),

  findById: organisationMemberProcedure
    .input(JoinOrganisation)
    .query(async ({ ctx, input }) => {
      const organisation = await ctx.db.organisation.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!organisation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organisation not found",
        });

      const members = await getUsersThatSatifiesRole({
        db: ctx.db,
        roleId: organisation.memberRoleId,
        role: RoleTexts.MEMBER,
      });

      const moderator = await getUsersThatSatifiesRole({
        db: ctx.db,
        roleId: organisation.moderatorRoleId,
        role: RoleTexts.MODERATOR,
      });

      const admin = await getUsersThatSatifiesRole({
        db: ctx.db,
        roleId: organisation.adminRoleId,
        role: RoleTexts.ADMIN,
      });

      return {
        organisation,
        members: [...members, ...moderator, ...admin],
      };
    }),
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const userRoleLinks = await ctx.db.userRoleLink.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const organisations = await Promise.all(
      userRoleLinks.map(async (userRoleLink) => {
        const tempOrganisations = await ctx.db.organisation.findMany({
          where: {
            OR: [
              { adminRoleId: userRoleLink.roleId },
              { moderatorRoleId: userRoleLink.roleId },
              { memberRoleId: userRoleLink.roleId },
            ],
          },
        });
        if (!!tempOrganisations[0]) return tempOrganisations[0];
        return null;
      }),
    );

    const filtedOrganisations = organisations.filter(
      (organisation): organisation is Organisation => organisation !== null,
    );

    return filtedOrganisations;
  }),

  getRoleByUserId: protectedProcedure
    .input(organisationIdSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const organisation = await ctx.db.organisation.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!organisation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organisation not found",
        });

      const userIsAdmin = await ctx.db.userRoleLink.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: organisation.adminRoleId,
        },
      });

      if (userIsAdmin) return RoleTexts.ADMIN;

      const userIsModerator = await ctx.db.userRoleLink.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: organisation.moderatorRoleId,
        },
      });

      if (userIsModerator) return RoleTexts.MODERATOR;

      const userIsMember = await ctx.db.userRoleLink.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: organisation.memberRoleId,
        },
      });

      if (userIsMember) return RoleTexts.MEMBER;

      if (!userIsAdmin && !userIsModerator && !userIsMember)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User is not an part of this organisation",
        });
    }),
  setRoleForMember: organisationModeratorProcedure
    .input(
      z
        .object({
          userId: z.string(),
          newRole: z.string(),
        })
        .extend(organisationIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const organisation = await ctx.db.organisation.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!organisation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organisation not found",
        });

      //if new role is admin --> throw error
      if (input.newRole === RoleTexts.ADMIN) {
        if (!organisation)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only one admin is allowed",
          });
      }

      //if new role is moderator --> check if user is member
      if (input.newRole === RoleTexts.MODERATOR) {
        const userIsMember = await ctx.db.userRoleLink.findFirst({
          where: {
            userId: input.userId,
          },
        });

        if (!userIsMember)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User is not a member of this organisation",
          });

        await ctx.db.userRoleLink.update({
          where: {
            id: userIsMember.id,
          },
          data: {
            roleId: organisation.moderatorRoleId,
          },
        });
      }
      //if new role is member --> check if user is moderator
      if (input.newRole === RoleTexts.MEMBER) {
        const userIsModerator = await ctx.db.userRoleLink.findFirst({
          where: {
            userId: input.userId,
            roleId: organisation.moderatorRoleId,
          },
        });

        if (!userIsModerator)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User is not a moderator of this organisation",
          });

        await ctx.db.userRoleLink.updateMany({
          where: {
            id: userIsModerator.id,
          },
          data: {
            roleId: organisation.memberRoleId,
          },
        });
      }
    }),
});

async function getUsersThatSatifiesRole({
  db,
  roleId,
  role,
}: {
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  roleId: string;
  role: RoleText;
}) {
  const usersSatifiesRole = await db.userRoleLink.findMany({
    where: {
      roleId: roleId,
    },
  });

  const users = (
    await Promise.all(
      usersSatifiesRole.map(async (member) => {
        return await db.user.findUnique({
          where: {
            id: member.userId,
          },
        });
      }),
    )
  ).filter((user): user is User => user !== null);

  const usersWithRole = users.map((user) => {
    return {
      ...user,
      role: role,
    };
  });

  return usersWithRole;
}
