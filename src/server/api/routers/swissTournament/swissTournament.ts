import {
  createTRPCRouter,
  teamMemberProcedure,
  teamModeratorProcedure,
} from "@/server/api/trpc";
import {
  CreateSwissTournament,
  GetAllSwissTournament,
  GetSwissTournament,
} from "./swiss-tournament-types";
import { z } from "zod";

export const swissTournamentRouter = createTRPCRouter({
  create: teamModeratorProcedure
    .input(CreateSwissTournament)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        roundLimit,
        teamId,
        isOpen,
        leagueId,
        participants,
        description,
      } = input;

      const userId = ctx.session.user.id;

      const swissTournament = await ctx.db.swissTournament.create({
        data: {
          name,
          roundLimit,
          isOpen,
          description,
          userId,
          leagueId,
          teamId,
        },
      });

      const swissUsers = await Promise.all(
        participants.map(async (userId) => {
          return await ctx.db.swissTournamentUser.create({
            data: {
              userId,
              swissTournamentId: swissTournament.id,
              teamId,
              leagueId,
            },
          });
        }),
      );

      return { swissTournament, swissUsers };
    }),
  get: teamMemberProcedure
    .input(GetSwissTournament)
    .query(async ({ input, ctx }) => {
      const { teamId, tournamentId } = input;
      const userId = ctx.session.user.id;

      const swissTournament = await ctx.db.swissTournament.findUnique({
        where: {
          teamId,
          id: tournamentId,
        },
        include: {
          team: true,
        },
      });

      if (!swissTournament) {
        throw new Error("Tournament not found");
      }

      const swissUsers = await ctx.db.swissTournamentUser.findMany({
        where: {
          swissTournamentId: tournamentId,
          teamId,
          userId,
        },
      });

      const teamUsers = await Promise.all(
        swissUsers.map(async (swissUser) => {
          const teamUser = await ctx.db.teamUser.findUnique({
            where: {
              userId_teamId: {
                teamId,
                userId: swissUser.userId,
              },
            },
          });

          return teamUser;
        }),
      );

      return {
        team: swissTournament.team,
        tournament: swissTournament,
        swissUsers,
        teamUsers,
      };
    }),

  getAll: teamMemberProcedure
    .input(GetAllSwissTournament)
    .query(async ({ input, ctx }) => {
      const { teamId, leagueId } = input;

      const swissTournaments = await ctx.db.swissTournament.findMany({
        where: {
          teamId,
          leagueId,
        },
      });

      return swissTournaments;
    }),

  join: teamMemberProcedure
    .input(GetSwissTournament)
    .mutation(async ({ input, ctx }) => {
      const { teamId, leagueId, tournamentId } = input;
      const userId = ctx.session.user.id;

      const swissUser = await ctx.db.swissTournamentUser.create({
        data: {
          userId,
          swissTournamentId: tournamentId,
          teamId,
          leagueId,
        },
      });

      return swissUser;
    }),

  leave: teamMemberProcedure
    .input(GetSwissTournament)
    .mutation(async ({ input, ctx }) => {
      const { teamId, leagueId, tournamentId } = input;
      const userId = ctx.session.user.id;

      const swissUser = await ctx.db.swissTournamentUser.delete({
        where: {
          userId_swissTournamentId: {
            userId,
            swissTournamentId: tournamentId,
          },
          teamId,
          leagueId,
        },
      });

      return swissUser;
    }),
  addPlayer: teamMemberProcedure
    .input(
      GetSwissTournament.extend(
        z.object({
          userId: z.string().min(1),
        }).shape,
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, leagueId, tournamentId, userId } = input;

      const swissUser = await ctx.db.swissTournamentUser.create({
        data: {
          userId,
          swissTournamentId: tournamentId,
          teamId,
          leagueId,
        },
      });

      return swissUser;
    }),

  removePlayer: teamModeratorProcedure
    .input(
      GetSwissTournament.extend(
        z.object({
          userId: z.string().min(1),
        }).shape,
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, leagueId, tournamentId, userId } = input;

      const swissUser = await ctx.db.swissTournamentUser.delete({
        where: {
          userId_swissTournamentId: {
            userId,
            swissTournamentId: tournamentId,
          },
          teamId,
          leagueId,
        },
      });

      return swissUser;
    }),
});
