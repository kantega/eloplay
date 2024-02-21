import {
  createTRPCRouter,
  teamAdminProcedure,
  teamMemberProcedure,
  teamModeratorProcedure,
} from "@/server/api/trpc";
import { teamIdSchema } from "@/server/types/teamTypes";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const leagueRouter = createTRPCRouter({
  create: teamModeratorProcedure
    .input(z.object({ name: z.string().min(1) }).extend(teamIdSchema.shape))
    .mutation(async ({ ctx, input }) => {
      const league = await ctx.db.league.create({
        data: {
          name: input.name,
          teamId: input.id,
        },
      });

      const team = await ctx.db.team.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      const allMembers = await ctx.db.teamUser.findMany({
        where: {
          OR: [
            { roleId: team.adminRoleId },
            { roleId: team.moderatorRoleId },
            { roleId: team.memberRoleId },
          ],
        },
      });

      // all members of the team are now part of the league
      await Promise.all(
        allMembers.map(async (teamUser) => {
          const leagueUser = await ctx.db.leagueUser.create({
            data: {
              userId: teamUser.userId,
              teamId: teamUser.teamId,
              leagueId: league.id,
            },
          });
          return leagueUser;
        }),
      );

      return league;
    }),
  find: teamMemberProcedure
    .input(z.object({ leagueId: z.string().min(1) }).extend(teamIdSchema.shape))
    .query(async ({ ctx, input }) => {
      return await ctx.db.league.findUnique({
        where: {
          id: input.leagueId,
          teamId: input.id,
        },
      });
    }),
  findAll: teamMemberProcedure
    .input(teamIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.league.findMany({
        where: {
          teamId: input.id,
        },
      });
    }),
  delete: teamAdminProcedure
    .input(z.object({ leagueId: z.string().min(1) }).extend(teamIdSchema.shape))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.leagueUser.deleteMany({
        where: { leagueId: input.leagueId },
      });

      await ctx.db.leagueMatch.deleteMany({
        where: { leagueId: input.leagueId },
      });

      return ctx.db.league.delete({
        where: {
          id: input.leagueId,
        },
      });
    }),
  updateName: teamModeratorProcedure
    .input(
      z
        .object({ name: z.string().min(1), leagueId: z.string().min(1) })
        .extend(teamIdSchema.shape),
    )
    .mutation(async ({ ctx, input }) => {
      const league = await ctx.db.league.update({
        where: {
          id: input.leagueId,
        },
        data: {
          name: input.name,
        },
      });

      return league;
    }),
});
