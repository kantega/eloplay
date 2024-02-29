import { createTRPCRouter, teamModeratorProcedure } from "@/server/api/trpc";
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import { CreateSwissTournament } from "./swiss-tournament-types";

export const swissTournamentRouter = createTRPCRouter({
  create: teamModeratorProcedure
    .input(CreateSwissTournament.extend(teamIdSchema.shape))
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        roundLimit,
        teamId,
        isOpen,
        leagueId,
        participants,
        description,
      } = input;

      const userId = ctx.session.user.id;

      const swissTournament = await ctx.db.swissTournament.create({
        data: {
          name,
          roundLimit,
          isOpen,
          description,
          userId,
          leagueId,
          teamId,
        },
      });

      const swissUsers = await Promise.all(
        participants.map(async (userId) => {
          return await ctx.db.swissTournamentUser.create({
            data: {
              userId,
              swissTournamentId: swissTournament.id,
              teamId,
              leagueId,
            },
          });
        }),
      );

      return { swissTournament, swissUsers };
    }),
});
