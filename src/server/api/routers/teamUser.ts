import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import { z } from "zod";

export const teamUserRouter = createTRPCRouter({
  get: protectedProcedure.input(teamIdSchema).query(async ({ ctx, input }) => {
    return await ctx.db.teamUser.findFirst({
      where: {
        teamId: input.teamId,
        userId: ctx.session.user.id,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z
        .object({ gamerTag: z.string().min(1), teamUserId: z.string().min(1) })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.teamUser.update({
        where: {
          id: input.teamUserId,
          teamId: input.teamId,
        },
        data: {
          gamerTag: input.gamerTag,
        },
      });
    }),
});
