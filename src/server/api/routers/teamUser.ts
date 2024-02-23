import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import { type TeamUserWithLeagueUser } from "@/utils/player";
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
  getAll: protectedProcedure
    .input(z.object({ leagueId: z.string().min(1) }).extend(teamIdSchema.shape))
    .query(async ({ ctx, input }) => {
      const teamUsers = await ctx.db.teamUser.findMany({
        where: {
          teamId: input.teamId,
        },
      });

      const teamAndLeagueUser = (
        await Promise.all(
          teamUsers.map(async (teamUser) => {
            const leagueUser = await ctx.db.leagueUser.findFirst({
              where: {
                userId: teamUser.userId,
                leagueId: input.leagueId,
                teamId: input.teamId,
              },
            });

            return { teamUser, leagueUser };
          }),
        )
      ).filter(
        (teamAndLeagueUser): teamAndLeagueUser is TeamUserWithLeagueUser =>
          teamAndLeagueUser.leagueUser !== null,
      );

      return teamAndLeagueUser;
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
