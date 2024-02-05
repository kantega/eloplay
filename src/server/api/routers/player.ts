import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const playerRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), office: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.player.create({
        data: {
          name: input.name,
          office: input.office,
        },
      });
    }),
});
