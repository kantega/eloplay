import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CreatePlayer } from "@/server/types/playerTypes";
import { z } from "zod";

export const playerRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreatePlayer)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableTennisPlayer.create({
        data: {
          name: input.name,
          office: input.office,
        },
      });
    }),

  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tableTennisPlayer.findMany();
  }),

  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.tableTennisPlayer.findUnique({
        where: { id: input.id },
      });
    }),
});
