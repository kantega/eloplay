import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CreatePlayer } from "@/server/types/playerTypes";

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
});
