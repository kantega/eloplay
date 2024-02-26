import {
  createTRPCRouter,
  protectedProcedure,
  teamMemberProcedure,
} from "@/server/api/trpc";
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Team, type TeamUser } from "@prisma/client";
import { RoleTexts } from "@/server/types/roleTypes";

export const teamUserRouter = createTRPCRouter({
  get: teamMemberProcedure.input(teamIdSchema).query(async ({ ctx, input }) => {
    return await ctx.db.teamUser.findFirst({
      where: {
        teamId: input.teamId,
        userId: ctx.session.user.id,
      },
    });
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const teamUsers = await ctx.db.teamUser.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const teamAndTeamUser = (
      await Promise.all(
        teamUsers.map(async (teamUser) => {
          const team = await ctx.db.team.findUnique({
            where: {
              id: teamUser.teamId,
            },
          });

          return { teamUser, team };
        }),
      )
    ).filter(
      (
        teamAndTeamUser,
      ): teamAndTeamUser is {
        teamUser: TeamUser;
        team: Team;
      } => teamAndTeamUser.team !== null,
    );

    return teamAndTeamUser.map((teamAndTeamUser) => {
      const { roleId } = teamAndTeamUser.teamUser;
      const { adminRoleId, moderatorRoleId } = teamAndTeamUser.team;

      const role =
        roleId === adminRoleId
          ? RoleTexts.ADMIN
          : roleId === moderatorRoleId
            ? RoleTexts.MODERATOR
            : RoleTexts.MEMBER;
      return { ...teamAndTeamUser, role };
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
