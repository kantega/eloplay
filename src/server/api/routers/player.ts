import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { offices } from "@/server/types/officeTypes";
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

  findAll: publicProcedure
    .input(z.object({ office: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.office === offices.All)
        return ctx.db.tableTennisPlayer.findMany();

      return ctx.db.tableTennisPlayer.findMany({
        where: { office: input.office },
      });
    }),

  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.tableTennisPlayer.findUnique({
        where: { id: input.id },
      });
    }),
});
