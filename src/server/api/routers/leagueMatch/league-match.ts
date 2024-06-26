import {
  createTRPCRouter,
  protectedProcedure,
  teamMemberProcedure,
} from "@/server/api/trpc";
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import { updateEloRating } from "@/utils/elo";
import {
  addEloToLatestEloList,
  getNewEloList,
  getStreak,
  newLeagueUserStreak,
} from "@/server/api/routers/leagueMatch/league-match-utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const leagueMatchRouter = createTRPCRouter({
  create: teamMemberProcedure
    .input(
      z
        .object({
          leagueId: z.string().min(1),
          winnerId: z.string().min(1),
          loserId: z.string().min(1),
        })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.winnerId === input.loserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Winner and loser cannot be the same",
        });
      }

      const leagueWinner = await ctx.db.leagueUser.findFirst({
        where: {
          userId: input.winnerId,
          leagueId: input.leagueId,
          teamId: input.teamId,
        },
      });

      if (!leagueWinner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Winner not found in league",
        });
      }

      const leagueLoser = await ctx.db.leagueUser.findFirst({
        where: {
          userId: input.loserId,
          leagueId: input.leagueId,
          teamId: input.teamId,
        },
      });

      if (!leagueLoser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Loser not found in league",
        });
      }

      const leagueMatch = await ctx.db.leagueMatch.create({
        data: {
          preLoserElo: leagueLoser.elo,
          preWinnerElo: leagueWinner.elo,
          leagueId: input.leagueId,
          winnerId: input.winnerId,
          loserId: input.loserId,
          teamId: input.teamId,
        },
      });

      const matchNewElos = updateEloRating(leagueWinner.elo, leagueLoser.elo);

      // update stats on league users and league
      await ctx.db.leagueUser.update({
        where: {
          id: leagueWinner.id,
          teamId: input.teamId,
        },
        data: {
          elo: matchNewElos[0],
          matchCount: leagueWinner.matchCount + 1,
          streak: newLeagueUserStreak({ streak: leagueWinner.streak, add: 1 }),
          latestEloGain: addEloToLatestEloList(
            leagueWinner.latestEloGain,
            matchNewElos[0] - leagueWinner.elo,
          ),
        },
      });

      await ctx.db.leagueUser.update({
        where: {
          id: leagueLoser.id,
          teamId: input.teamId,
        },
        data: {
          elo: matchNewElos[1],
          matchLossCount: leagueLoser.matchLossCount + 1,
          matchCount: leagueLoser.matchCount + 1,
          streak: newLeagueUserStreak({ streak: leagueLoser.streak, add: -1 }),
          latestEloGain: addEloToLatestEloList(
            leagueLoser.latestEloGain,
            matchNewElos[1] - leagueLoser.elo,
          ),
        },
      });

      await ctx.db.league.update({
        where: { id: input.leagueId, teamId: input.teamId },
        data: {
          matchCount: {
            increment: 1,
          },
        },
      });

      return { leagueMatch };
    }),
  delete: teamMemberProcedure
    .input(
      z
        .object({
          leagueMatchId: z.string().min(1),
        })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      const leagueMatch = await ctx.db.leagueMatch.findUnique({
        where: {
          id: input.leagueMatchId,
          teamId: input.teamId,
        },
      });

      if (!leagueMatch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League match not found",
        });
      }

      const leagueWinner = await ctx.db.leagueUser.findFirst({
        where: {
          userId: leagueMatch.winnerId,
          leagueId: leagueMatch.leagueId,
          teamId: input.teamId,
        },
      });

      if (!leagueWinner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Winner not found in league",
        });
      }

      const leagueLoser = await ctx.db.leagueUser.findFirst({
        where: {
          userId: leagueMatch.loserId,
          leagueId: leagueMatch.leagueId,
          teamId: input.teamId,
        },
      });

      if (!leagueLoser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Loser not found in league",
        });
      }

      await ctx.db.leagueMatch.delete({
        where: {
          id: input.leagueMatchId,
          teamId: input.teamId,
        },
      });

      const matchNewElos = updateEloRating(
        leagueMatch.preWinnerElo,
        leagueMatch.preLoserElo,
      );

      const winnerEloGain = matchNewElos[0] - leagueMatch.preWinnerElo;
      const loserEloGain = matchNewElos[1] - leagueMatch.preLoserElo;

      //!
      //!
      //!

      const winnerMatches = await ctx.db.leagueMatch.findMany({
        where: {
          OR: [
            { winnerId: leagueMatch.winnerId },
            { loserId: leagueMatch.winnerId },
          ],
          leagueId: leagueMatch.leagueId,
          teamId: input.teamId,
        },
        orderBy: {
          id: "asc",
        },
        take: 20,
      });

      const newWinnerStreak = getStreak(winnerMatches, leagueMatch.winnerId);

      // update stats on league users and league
      await ctx.db.leagueUser.update({
        where: {
          id: leagueWinner.id,
          teamId: input.teamId,
        },
        data: {
          elo: leagueWinner.elo - winnerEloGain,
          matchCount: leagueWinner.matchCount - 1,
          streak: newWinnerStreak,
          latestEloGain: getNewEloList(winnerMatches, leagueMatch.winnerId),
        },
      });

      const loserMatches = await ctx.db.leagueMatch.findMany({
        where: {
          OR: [
            { winnerId: leagueMatch.winnerId },
            { loserId: leagueMatch.winnerId },
          ],
          leagueId: leagueMatch.leagueId,
          teamId: input.teamId,
        },
        orderBy: {
          id: "asc",
        },
        take: 20,
      });

      const newLoserStreak = getStreak(loserMatches, leagueMatch.winnerId);

      await ctx.db.leagueUser.update({
        where: {
          id: leagueLoser.id,
          teamId: input.teamId,
        },
        data: {
          elo: leagueLoser.elo - loserEloGain,
          matchLossCount: leagueLoser.matchLossCount - 1,
          matchCount: leagueLoser.matchCount - 1,
          streak: newLoserStreak,
          latestEloGain: getNewEloList(loserMatches, leagueMatch.loserId),
        },
      });

      return true;
    }),
  getAll: teamMemberProcedure
    .input(z.object({ leagueId: z.string().min(1) }).extend(teamIdSchema.shape))
    .query(async ({ ctx, input }) => {
      const leagueMatches = await ctx.db.leagueMatch.findMany({
        where: {
          leagueId: input.leagueId,
          teamId: input.teamId,
        },
      });

      // todo: optimize this, you can cache the team users and fetch from the cache, not neccaesarily to get them form the db every time
      const leagueMatchesWithProfiles = await Promise.all(
        leagueMatches.map(async (match) => {
          const winnerTeamUser = await ctx.db.teamUser.findFirst({
            where: {
              userId: match.winnerId,
              teamId: input.teamId,
            },
          });

          if (!winnerTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          const loserTeamUser = await ctx.db.teamUser.findFirst({
            where: {
              userId: match.loserId,
              teamId: input.teamId,
            },
          });

          if (!loserTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          return {
            match,
            winnerTeamUser,
            loserTeamUser,
          };
        }),
      );

      return { leagueMatchesWithProfiles };
    }),
  getAllInfinite: teamMemberProcedure
    .input(
      z
        .object({
          limit: z.number(),
          cursor: z.string().nullish(),
          skip: z.number().optional(),
          leagueId: z.string().min(1),
        })
        .extend(teamIdSchema.shape),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, leagueId, teamId, cursor } = input;
      const leagueMatches = await ctx.db.leagueMatch.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        where: {
          leagueId,
          teamId,
        },
      });

      // todo: optimize this, you can cache the team users and fetch from the cache, not neccaesarily to get them form the db every time
      const leagueMatchesWithProfiles = await Promise.all(
        leagueMatches.map(async (match) => {
          const winnerTeamUser = await ctx.db.teamUser.findFirst({
            where: {
              userId: match.winnerId,
              teamId: input.teamId,
            },
          });

          if (!winnerTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          const loserTeamUser = await ctx.db.teamUser.findFirst({
            where: {
              userId: match.loserId,
              teamId: input.teamId,
            },
          });

          if (!loserTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          return {
            match,
            winnerTeamUser,
            loserTeamUser,
          };
        }),
      );

      let nextCursor: typeof cursor | undefined = undefined;
      if (leagueMatchesWithProfiles.length > limit) {
        const nextItem = leagueMatchesWithProfiles.pop(); // return the last item from the array
        nextCursor = nextItem?.match.id;
      }

      return { leagueMatchesWithProfiles, nextCursor };
    }),
  getAllByLeagueUserId: protectedProcedure
    .input(
      z
        .object({
          leagueUserId: z.string().min(1),
          leagueId: z.string().min(1),
        })
        .extend(teamIdSchema.shape),
    )
    .query(async ({ ctx, input }) => {
      const leagueUser = await ctx.db.leagueUser.findUnique({
        where: { id: input.leagueUserId, teamId: input.teamId },
      });

      if (!leagueUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League user not found",
        });
      }

      const userId = leagueUser.userId;

      const teamUser = await ctx.db.teamUser.findFirst({
        where: {
          userId,
          teamId: input.teamId,
        },
      });

      if (!teamUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team user not found",
        });
      }

      const leagueMatches = await ctx.db.leagueMatch.findMany({
        where: {
          leagueId: input.leagueId,
          OR: [{ winnerId: userId }, { loserId: userId }],
          teamId: input.teamId,
        },
      });

      const leagueMatchesWithProfiles = await Promise.all(
        leagueMatches.map(async (match) => {
          let winnerTeamUser;
          let loserTeamUser;
          if (match.winnerId === userId) {
            winnerTeamUser = teamUser;
            loserTeamUser = await ctx.db.teamUser.findFirst({
              where: {
                userId: match.loserId,
                teamId: input.teamId,
              },
            });
          } else {
            loserTeamUser = teamUser;
            winnerTeamUser = await ctx.db.teamUser.findFirst({
              where: {
                userId: match.winnerId,
                teamId: input.teamId,
              },
            });
          }

          if (!winnerTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          if (!loserTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          return {
            match,
            winnerTeamUser,
            loserTeamUser,
          };
        }),
      );

      return { leagueMatchesWithProfiles };
    }),
  getAllInfiniteByLeagueUserId: protectedProcedure
    .input(
      z
        .object({
          limit: z.number(),
          cursor: z.string().nullish(),
          skip: z.number().optional(),
          leagueUserId: z.string().min(1),
          leagueId: z.string().min(1),
        })
        .extend(teamIdSchema.shape),
    )
    .query(async ({ ctx, input }) => {
      const leagueUser = await ctx.db.leagueUser.findUnique({
        where: { id: input.leagueUserId, teamId: input.teamId },
      });

      if (!leagueUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League user not found",
        });
      }

      const userId = leagueUser.userId;

      const teamUser = await ctx.db.teamUser.findFirst({
        where: {
          userId,
          teamId: input.teamId,
        },
      });

      if (!teamUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team user not found",
        });
      }

      const leagueMatches = await ctx.db.leagueMatch.findMany({
        take: input.limit + 1,
        skip: input.skip,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        where: {
          leagueId: input.leagueId,
          OR: [{ winnerId: userId }, { loserId: userId }],
          teamId: input.teamId,
        },
      });

      const leagueMatchesWithProfiles = await Promise.all(
        leagueMatches.map(async (match) => {
          let winnerTeamUser;
          let loserTeamUser;
          if (match.winnerId === userId) {
            winnerTeamUser = teamUser;
            loserTeamUser = await ctx.db.teamUser.findFirst({
              where: {
                userId: match.loserId,
                teamId: input.teamId,
              },
            });
          } else {
            loserTeamUser = teamUser;
            winnerTeamUser = await ctx.db.teamUser.findFirst({
              where: {
                userId: match.winnerId,
                teamId: input.teamId,
              },
            });
          }

          if (!winnerTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          if (!loserTeamUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Winner team user not found",
            });
          }

          return {
            match,
            winnerTeamUser,
            loserTeamUser,
          };
        }),
      );

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (leagueMatchesWithProfiles.length > input.limit) {
        const nextItem = leagueMatchesWithProfiles.pop(); // return the last item from the array
        nextCursor = nextItem?.match.id;
      }

      return { leagueMatchesWithProfiles, nextCursor };
    }),
});
