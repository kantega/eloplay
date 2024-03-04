import {
  createTRPCRouter,
  teamMemberProcedure,
  teamModeratorProcedure,
  tournamentModeratorProcedure,
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
      const { teamId, leagueId, tournamentId } = input;

      const swissTournament = await ctx.db.swissTournament.findUnique({
        where: {
          teamId,
          leagueId,
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

      const matches = await ctx.db.swissTournamentMatch.findMany({
        where: {
          teamId,
          leagueId,
          tournamentId,
        },
      });

      return {
        team: swissTournament.team,
        tournament: swissTournament,
        swissUsers,
        teamUsers,
        matches,
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
  addPlayer: tournamentModeratorProcedure
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

  removePlayer: tournamentModeratorProcedure
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
  start: tournamentModeratorProcedure
    .input(GetSwissTournament)
    .mutation(async ({ input, ctx }) => {
      const { teamId, leagueId, tournamentId } = input;

      const swissUsers = await ctx.db.swissTournamentUser.findMany({
        where: {
          swissTournamentId: tournamentId,
          teamId,
          leagueId,
        },
      });

      if (!(swissUsers.length > 1 && swissUsers.length % 2 === 0))
        throw new Error("Not enough players to start tournament");

      const swissTournament = await ctx.db.swissTournament.update({
        where: {
          id: tournamentId,
          teamId,
          leagueId,
        },
        data: {
          isOpen: false,
          currentRound: { increment: 1 },
        },
      });

      // first shuffle the array, then sort on score
      const shuffledUsers = swissUsers.sort(() => Math.random() - 0.5);
      const sortedUsers = shuffledUsers.sort((a, b) => b.score - a.score);

      // create matches for two and two players
      const matches = [];
      for (let i = 0; i < sortedUsers.length; i += 2) {
        const player1 = sortedUsers[i];
        const player2 = sortedUsers[i + 1];
        if (!!sortedUsers && !!player1 && !!player2) {
          matches.push({
            teamId,
            leagueId,
            tournamentId,
            userId1: player1.userId,
            userId2: player2.userId,
            round: swissTournament.currentRound,
          });
        }
      }

      const swissMatches = await ctx.db.swissTournamentMatch.createMany({
        data: matches,
      });

      return { matches: swissMatches };
    }),
  registerMatchResult: tournamentModeratorProcedure
    .input(
      GetSwissTournament.extend(
        z.object({
          matchId: z.string().min(1),
          winnerId: z.string().min(1),
        }).shape,
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, leagueId, tournamentId, matchId, winnerId } = input;

      const swissMatch = await ctx.db.swissTournamentMatch.update({
        where: {
          id: matchId,
          teamId,
          leagueId,
          tournamentId,
        },
        data: {
          winnerId,
        },
      });

      const swissUser = await ctx.db.swissTournamentUser.update({
        where: {
          userId_swissTournamentId: {
            userId: winnerId,
            swissTournamentId: tournamentId,
          },
          teamId,
          leagueId,
        },
        data: {
          score: { increment: 1 },
        },
      });

      return { swissMatch, swissUser };
    }),
});
