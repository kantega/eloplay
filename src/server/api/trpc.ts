/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { z, ZodError } from "zod";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { teamIdSchema } from "./routers/team/team-types";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  session: Session | null;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const teamAdminProcedure = t.procedure.use(
  async ({ ctx, rawInput, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { teamId: id } = teamIdSchema.parse(rawInput);

    const team = await ctx.db.team.findUnique({
      where: {
        id,
      },
    });

    if (!team)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });

    const userIsAdmin = await ctx.db.teamUser.findFirst({
      where: {
        userId: ctx.session.user.id,
        teamId: id,
        roleId: team.adminRoleId,
      },
    });

    if (!userIsAdmin)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not an admin of this team",
      });

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  },
);

export const teamModeratorProcedure = t.procedure.use(
  async ({ ctx, rawInput, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { teamId: id } = teamIdSchema.parse(rawInput);

    const team = await ctx.db.team.findUnique({
      where: {
        id,
      },
    });

    if (!team)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });

    const teamUser = await ctx.db.teamUser.findFirst({
      where: {
        userId: ctx.session.user.id,
        teamId: id,
        OR: [{ roleId: team.moderatorRoleId }, { roleId: team.adminRoleId }],
      },
    });

    if (!teamUser)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "TeamUser with role moderator or admin not found",
      });

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  },
);

export const teamMemberProcedure = t.procedure.use(
  async ({ ctx, rawInput, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { teamId: id } = teamIdSchema.parse(rawInput);

    const team = await ctx.db.team.findUnique({
      where: {
        id,
      },
    });

    if (!team)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });

    const teamUser = await ctx.db.teamUser.findFirst({
      where: {
        userId: ctx.session.user.id,
        teamId: id,
      },
    });

    if (!teamUser)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "TeamUser not found",
      });

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  },
);

export const tournamentModeratorProcedure = t.procedure.use(
  async ({ ctx, rawInput, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { teamId, tournamentId } = teamIdSchema
      .extend(z.object({ tournamentId: z.string().min(1) }).shape)
      .parse(rawInput);

    //! owners should always have tournament moderator rights
    const tournament = await ctx.db.swissTournament.findUnique({
      where: {
        userId: ctx.session.user.id,
        id: tournamentId,
      },
    });

    if (!!tournament)
      return next({
        ctx: {
          // infers the `session` as non-nullable
          session: { ...ctx.session, user: ctx.session.user },
        },
      });

    //! if user is not owner, check if user is a moderator of the team
    const team = await ctx.db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });

    const teamUser = await ctx.db.teamUser.findFirst({
      where: {
        userId: ctx.session.user.id,
        teamId: teamId,
        OR: [{ roleId: team.moderatorRoleId }, { roleId: team.adminRoleId }],
      },
    });

    if (!teamUser)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "TeamUser not found",
      });

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  },
);

export const tournamentMatchModeratorProcedure = t.procedure.use(
  async ({ ctx, rawInput, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { teamId, tournamentId } = teamIdSchema
      .extend(z.object({ tournamentId: z.string().min(1) }).shape)
      .parse(rawInput);

    //! owners should always have tournament moderator rights
    const tournament = await ctx.db.swissTournament.findUnique({
      where: {
        userId: ctx.session.user.id,
        id: tournamentId,
      },
    });

    //! users in match should have tournament match moderator rights
    const tournamentMatch = await ctx.db.swissTournamentMatch.findUnique({
      where: {
        id: tournamentId,
        OR: [
          { userId1: ctx.session.user.id },
          { userId2: ctx.session.user.id },
        ],
      },
    });

    if (!!tournament || !!tournamentMatch)
      return next({
        ctx: {
          // infers the `session` as non-nullable
          session: { ...ctx.session, user: ctx.session.user },
        },
      });

    //! if user is not owner, check if user is a moderator of the team
    const team = await ctx.db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });

    const teamUser = await ctx.db.teamUser.findFirst({
      where: {
        userId: ctx.session.user.id,
        teamId: teamId,
        OR: [{ roleId: team.moderatorRoleId }, { roleId: team.adminRoleId }],
      },
    });

    if (!teamUser)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "TeamUser not found",
      });

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  },
);
