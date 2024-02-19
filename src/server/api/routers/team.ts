import {
  createTRPCRouter,
  teamMemberProcedure,
  teamModeratorProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { CreateTeam, JoinTeam, teamIdSchema } from "@/server/types/teamTypes";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import {
  type Team,
  type Prisma,
  type PrismaClient,
  type User,
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateTeam)
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

      const team = await ctx.db.team.create({
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

      return team;
    }),

  join: protectedProcedure.input(JoinTeam).mutation(async ({ ctx, input }) => {
    const team = await ctx.db.team.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!team)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });

    const userId = ctx.session.user.id;

    const userIsMember = await ctx.db.userRoleLink.findFirst({
      where: {
        userId: userId,
        OR: [
          { roleId: team.adminRoleId },
          { roleId: team.moderatorRoleId },
          { roleId: team.memberRoleId },
        ],
      },
    });

    if (userIsMember) return team;

    await ctx.db.userRoleLink.create({
      data: {
        userId: userId,
        roleId: team.memberRoleId,
      },
    });

    return team;
  }),

  findById: teamMemberProcedure
    .input(JoinTeam)
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      const members = await getUsersThatSatifiesRole({
        db: ctx.db,
        roleId: team.memberRoleId,
        role: RoleTexts.MEMBER,
      });

      const moderator = await getUsersThatSatifiesRole({
        db: ctx.db,
        roleId: team.moderatorRoleId,
        role: RoleTexts.MODERATOR,
      });

      const admin = await getUsersThatSatifiesRole({
        db: ctx.db,
        roleId: team.adminRoleId,
        role: RoleTexts.ADMIN,
      });

      return {
        team,
        members: [...members, ...moderator, ...admin],
      };
    }),
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const userRoleLinks = await ctx.db.userRoleLink.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const teams = await Promise.all(
      userRoleLinks.map(async (userRoleLink) => {
        const tempTeams = await ctx.db.team.findMany({
          where: {
            OR: [
              { adminRoleId: userRoleLink.roleId },
              { moderatorRoleId: userRoleLink.roleId },
              { memberRoleId: userRoleLink.roleId },
            ],
          },
        });
        if (!!tempTeams[0]) return tempTeams[0];
        return null;
      }),
    );

    const filtedTeams = teams.filter((team): team is Team => team !== null);

    return filtedTeams;
  }),

  getRoleByUserId: protectedProcedure
    .input(teamIdSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      const userIsAdmin = await ctx.db.userRoleLink.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: team.adminRoleId,
        },
      });

      if (userIsAdmin) return RoleTexts.ADMIN;

      const userIsModerator = await ctx.db.userRoleLink.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: team.moderatorRoleId,
        },
      });

      if (userIsModerator) return RoleTexts.MODERATOR;

      const userIsMember = await ctx.db.userRoleLink.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: team.memberRoleId,
        },
      });

      if (userIsMember) return RoleTexts.MEMBER;

      if (!userIsAdmin && !userIsModerator && !userIsMember)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User is not an part of this team",
        });
    }),
  setRoleForMember: teamModeratorProcedure
    .input(
      z
        .object({
          userId: z.string(),
          newRole: z.string(),
        })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      //if new role is admin --> throw error
      if (input.newRole === RoleTexts.ADMIN) {
        if (!team)
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
            message: "User is not a member of this team",
          });

        await ctx.db.userRoleLink.update({
          where: {
            id: userIsMember.id,
          },
          data: {
            roleId: team.moderatorRoleId,
          },
        });
      }
      //if new role is member --> check if user is moderator
      if (input.newRole === RoleTexts.MEMBER) {
        const userIsModerator = await ctx.db.userRoleLink.findFirst({
          where: {
            userId: input.userId,
            roleId: team.moderatorRoleId,
          },
        });

        if (!userIsModerator)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User is not a moderator of this team",
          });

        await ctx.db.userRoleLink.updateMany({
          where: {
            id: userIsModerator.id,
          },
          data: {
            roleId: team.memberRoleId,
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
