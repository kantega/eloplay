import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CreateMatch } from "@/server/types/matchTypes";
import { updateEloRating } from "@/utils/elo";

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

      const newElos = updateEloRating(
        player1.elo,
        player2.elo,
        input.winner as "player111" | "player222", //todo: eirik er flink <3
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
          player2Id: input.player1Id,
          winner: input.winner,
          prePlayer1Elo: player1.elo,
          prePlayer2Elo: player2.elo,
        },
      });
    }),

  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tableTennisMatch.findMany();
  }),
});
