import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CreateMatch } from "@/server/types/matchTypes";
import { matchResults, updateEloRating } from "@/utils/elo";
import { z } from "zod";

export const matchRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreateMatch)
    .mutation(async ({ ctx, input }) => {
      if (input.player1Id === input.player2Id)
        throw new Error("Player 1 and player 2 cannot be the same");

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

      const newElos = updateEloRating(
        player1.elo,
        player2.elo,
        matchResults.player111,
      );

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

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const match = await ctx.db.tableTennisMatch.findUnique({
        where: { id: input.id },
      });

      if (!match) {
        throw new Error(`Match ${input.id} not found`);
      }

      const player1 = await ctx.db.tableTennisPlayer.findUnique({
        where: { id: match.player1Id },
      });

      if (!player1) {
        throw new Error(`Player ${match.player1Id} not found`);
      }

      const player2 = await ctx.db.tableTennisPlayer.findUnique({
        where: { id: match.player2Id },
      });

      if (!player2) {
        throw new Error(`Player ${match.player2Id} not found`);
      }

      const newElos = updateEloRating(
        match.prePlayer1Elo,
        match.prePlayer2Elo,
        matchResults.player111,
      );

      await ctx.db.tableTennisPlayer.update({
        where: { id: match.player1Id },
        data: {
          ...player1,
          elo: player1.elo + (match.prePlayer1Elo - newElos[0]),
        },
      });

      await ctx.db.tableTennisPlayer.update({
        where: { id: match.player2Id },
        data: {
          ...player2,
          elo: player2.elo + (match.prePlayer2Elo - newElos[1]),
        },
      });

      return ctx.db.tableTennisMatch.delete({
        where: { id: input.id },
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
      const modifiedData = data.map(async (match) => {
        const player1 = await ctx.db.tableTennisPlayer.findUnique({
          where: { id: match.player1Id },
        });
        const player2 = await ctx.db.tableTennisPlayer.findUnique({
          where: { id: match.player2Id },
        });

        if (!player1 || !player2) throw new Error("Player not found");
        match.winner = match.player1Id;
        match.player2Id = player2.name;
        match.player1Id = player1.name;
      });

      await Promise.all(modifiedData);

      return data;
    }),
});
