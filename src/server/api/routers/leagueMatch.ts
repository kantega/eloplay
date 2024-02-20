import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { teamIdSchema } from "@/server/types/teamTypes";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const leagueMatchRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ leagueId: z.string().min(1) }).extend(teamIdSchema.shape))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const leagueMatches = await ctx.db.leagueMatch.findMany({
        where: {
          leagueId: input.leagueId,
          OR: [{ winnerId: userId }, { loserId: userId }],
          teamId: input.id,
        },
      });

      // todo: add winner and loser profiles and match details

      return { leagueMatches };
    }),
  getAllById: protectedProcedure
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
        where: { id: input.leagueUserId },
      });

      if (!leagueUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League user not found",
        });
      }

      const userId = leagueUser.userId;

      const leagueMatches = await ctx.db.leagueMatch.findMany({
        where: {
          leagueId: input.leagueId,
          OR: [{ winnerId: userId }, { loserId: userId }],
          teamId: input.id,
        },
      });

      return { leagueMatches };
    }),
});
