import {
  createTRPCRouter,
  teamMemberProcedure,
  teamModeratorProcedure,
  protectedProcedure,
  teamAdminProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { CreateTeam, teamIdSchema } from "@/server/api/routers/team/team-types";
import { RoleTexts } from "@/server/types/roleTypes";
import { type Team } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type TeamMemberProps } from "@/server/api/routers/leagueMatch/league-match-utils";

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

      await ctx.db.teamUser.create({
        data: {
          teamId: team.id,
          userId: userId,
          roleId: adminRole.id,
          gamerTag: ctx.session.user.name ?? "No name",
          image: ctx.session.user.image ?? "https://github.com/shadcn.png",
        },
      });

      return team;
    }),

  join: protectedProcedure
    .input(teamIdSchema)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      const userId = ctx.session.user.id;

      const userIsMember = await ctx.db.teamUser.findFirst({
        where: {
          userId: userId,
          teamId: team.id,
          OR: [
            { roleId: team.adminRoleId },
            { roleId: team.moderatorRoleId },
            { roleId: team.memberRoleId },
          ],
        },
      });

      if (userIsMember) return team;

      await ctx.db.teamUser.create({
        data: {
          teamId: team.id,
          userId: userId,
          roleId: team.memberRoleId,
          gamerTag: ctx.session.user.name ?? "No name",
          image: ctx.session.user.image ?? "https://github.com/shadcn.png",
        },
      });

      // add user to all leagues of the team
      const allLeagues = await ctx.db.league.findMany({
        where: {
          teamId: input.teamId,
        },
      });

      await Promise.all(
        allLeagues.map(async (league) => {
          const leagueUser = await ctx.db.leagueUser.create({
            data: {
              userId: ctx.session.user.id,
              teamId: team.id,
              leagueId: league.id,
            },
          });
          return leagueUser;
        }),
      );

      return team;
    }),

  findById: teamMemberProcedure
    .input(teamIdSchema)
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      const teamUsers = await ctx.db.teamUser.findMany({
        where: {
          teamId: input.teamId,
        },
      });

      const teamUsersWithRole = teamUsers
        .map((member) => {
          let role = "";
          if (member.roleId === team.adminRoleId) role = RoleTexts.ADMIN;
          if (member.roleId === team.moderatorRoleId)
            role = RoleTexts.MODERATOR;
          if (member.roleId === team.memberRoleId) role = RoleTexts.MEMBER;
          return {
            ...member,
            role: role,
          };
        })
        .filter((teamUser): teamUser is TeamMemberProps => teamUser !== null);
      //todo: hmmm... can we fix this filter?

      return {
        team,
        teamUsers: teamUsersWithRole,
      };
    }),
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const teamUsers = await ctx.db.teamUser.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const teams = await Promise.all(
      teamUsers.map(async (teamUser) => {
        const tempTeams = await ctx.db.team.findMany({
          where: {
            OR: [
              { adminRoleId: teamUser.roleId },
              { moderatorRoleId: teamUser.roleId },
              { memberRoleId: teamUser.roleId },
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

  getRoleByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user || input.id === "")
        return RoleTexts.NOTMEMBER;

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

      const userIsAdmin = await ctx.db.teamUser.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: team.adminRoleId,
        },
      });

      if (userIsAdmin) return RoleTexts.ADMIN;

      const userIsModerator = await ctx.db.teamUser.findFirst({
        where: {
          userId: ctx.session.user.id,
          roleId: team.moderatorRoleId,
        },
      });

      if (userIsModerator) return RoleTexts.MODERATOR;

      const userIsMember = await ctx.db.teamUser.findFirst({
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
          teamUserId: z.string(),
          newRole: z.string(),
        })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      if (input.newRole === RoleTexts.MODERATOR) {
        return await ctx.db.teamUser.update({
          where: {
            teamId: input.teamId,
            id: input.teamUserId,
          },
          data: {
            roleId: team.moderatorRoleId,
          },
        });
      }

      if (input.newRole === RoleTexts.MEMBER) {
        return await ctx.db.teamUser.update({
          where: {
            teamId: input.teamId,
            id: input.teamUserId,
          },
          data: {
            roleId: team.memberRoleId,
          },
        });
      }
    }),
  changeTeamName: teamAdminProcedure
    .input(
      z
        .object({
          name: z.string(),
        })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      await ctx.db.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          name: input.name,
        },
      });

      return team;
    }),
});
