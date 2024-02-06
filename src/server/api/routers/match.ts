import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CreateMatch } from "@/server/types/matchTypes";
import { updateEloRating } from "@/utils/elo";
import { z } from "zod";

export const matchRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreateMatch)
    .mutation(async ({ ctx, input }) => {
      const player1 = await ctx.db.tableTennisPlayer.findUnique({
        where: { id: input.player1Id },
      });

      if (!player1) {
        throw new Error(`Player ${input.player1Id} not found`);
      }

      const player2 = await ctx.db.tableTennisPlayer.findUnique({
        where: { id: input.player2Id },
      });

      if (!player2) {
        throw new Error(`Player ${input.player2Id} not found`);
      }

      const newElos = updateEloRating(player1.elo, player2.elo, "player111");

      await ctx.db.tableTennisPlayer.update({
        where: { id: input.player1Id },
        data: { ...player1, elo: newElos[0] },
      });

      await ctx.db.tableTennisPlayer.update({
        where: { id: input.player2Id },
        data: { ...player2, elo: newElos[1] },
      });

      return ctx.db.tableTennisMatch.create({
        data: {
          player1Id: input.player1Id,
          player2Id: input.player2Id,
          winner: input.player1Id,
          prePlayer1Elo: player1.elo,
          prePlayer2Elo: player2.elo,
        },
      });
    }),

  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tableTennisMatch.findMany();
  }),

  findAllById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.tableTennisMatch.findMany({
        where: { OR: [{ player1Id: input.id }, { player2Id: input.id }] },
      });

      // todo: replace playerId with names

      return data;
    }),
});
