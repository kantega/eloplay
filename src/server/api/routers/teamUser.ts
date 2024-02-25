import { createTRPCRouter, teamMemberProcedure } from "@/server/api/trpc";
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const teamUserRouter = createTRPCRouter({
  get: teamMemberProcedure.input(teamIdSchema).query(async ({ ctx, input }) => {
    return await ctx.db.teamUser.findFirst({
      where: {
        teamId: input.teamId,
        userId: ctx.session.user.id,
      },
    });
  }),
  updateGamerTag: teamMemberProcedure
    .input(z.object({ gamerTag: z.string().min(1) }).extend(teamIdSchema.shape))
    .mutation(async ({ ctx, input }) => {
      const teamUser = await ctx.db.teamUser.findFirst({
        where: {
          teamId: input.teamId,
          userId: ctx.session.user.id,
        },
      });

      if (!teamUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team user not found",
        });

      await ctx.db.teamUser.update({
        where: {
          id: teamUser.id,
          teamId: input.teamId,
        },
        data: {
          gamerTag: input.gamerTag,
        },
      });
    }),
});
