import {
  createTRPCRouter,
  teamMemberProcedure,
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
          name: RoleTexts.ADMIN,
        },
      });

      const moderatorRole = await ctx.db.role.create({
        data: {
          name: RoleTexts.MODERATOR,
        },
      });

      const memberRole = await ctx.db.role.create({
        data: {
          name: RoleTexts.MEMBER,
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
          gamerTag: ctx.session.user.name?.slice(0, 20) ?? "No name",
          image: ctx.session.user.image ?? "https://github.com/shadcn.png",
        },
      });

      const league = await ctx.db.league.create({
        data: {
          name: input.leagueName,
          teamId: team.id,
        },
      });

      const leagueUser = await ctx.db.leagueUser.create({
        data: {
          userId: ctx.session.user.id,
          teamId: team.id,
          leagueId: league.id,
        },
      });

      return { team, league, leagueUser };
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

  getById: teamMemberProcedure
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
  getAll: protectedProcedure.query(async ({ ctx }) => {
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
        return RoleTexts.NOTMEMBER;
    }),
  updateRoleForMember: teamAdminProcedure
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
            NOT: {
              userId: ctx.session.user.id,
            },
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
            NOT: {
              userId: ctx.session.user.id,
            },
            teamId: input.teamId,
            id: input.teamUserId,
          },
          data: {
            roleId: team.memberRoleId,
          },
        });
      }
    }),
  updateTeamName: teamAdminProcedure
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

  transferTeamOwnerShip: teamAdminProcedure
    .input(
      z
        .object({
          newAdminUserId: z.string(),
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

      const newAdminUser = await ctx.db.teamUser.findFirst({
        where: {
          userId: input.newAdminUserId,
          teamId: input.teamId,
        },
      });

      if (!newAdminUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const oldAdminUser = await ctx.db.teamUser.findFirst({
        where: {
          userId: ctx.session.user.id,
          teamId: input.teamId,
          roleId: team.adminRoleId,
        },
      });

      if (!oldAdminUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin not found",
        });

      await ctx.db.teamUser.update({
        where: {
          id: newAdminUser.id,
          userId: input.newAdminUserId,
          teamId: input.teamId,
        },
        data: {
          roleId: team.adminRoleId,
        },
      });

      await ctx.db.teamUser.update({
        where: {
          id: oldAdminUser.id,
          userId: ctx.session.user.id,
          teamId: input.teamId,
        },
        data: {
          roleId: team.moderatorRoleId,
        },
      });

      return true;
    }),

  delete: teamAdminProcedure
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

      // todo: fix deletion of team with prisma cascade?

      await ctx.db.leagueMatch.deleteMany({
        where: {
          teamId: input.teamId,
        },
      });

      await ctx.db.leagueUser.deleteMany({
        where: {
          teamId: input.teamId,
        },
      });

      await ctx.db.league.deleteMany({
        where: {
          teamId: input.teamId,
        },
      });

      await ctx.db.teamUser.deleteMany({
        where: {
          teamId: input.teamId,
        },
      });

      await ctx.db.team.delete({
        where: {
          id: input.teamId,
        },
      });

      return team;
    }),

  leaveTeam: teamMemberProcedure
    .input(teamIdSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // todo: create a message/match history for the other player in the match
      await ctx.db.leagueMatch.deleteMany({
        where: {
          teamId: input.teamId,
          OR: [{ winnerId: userId }, { loserId: userId }],
        },
      });

      await ctx.db.leagueUser.deleteMany({
        where: {
          teamId: input.teamId,
          userId: userId,
        },
      });

      // todo: theres only one teamUser with the same teamId and userId, why is unique annotation not working?
      await ctx.db.teamUser.deleteMany({
        where: {
          teamId: input.teamId,
          userId: userId,
        },
      });

      return true;
    }),
});
