import { createTRPCRouter } from "@/server/api/trpc";
import { teamRouter } from "./routers/team";
import { leagueRouter } from "./routers/league";
import { teamUserRouter } from "./routers/teamUser";
import { leagueUserRouter } from "./routers/leagueUser";
import { leagueMatchRouter } from "./routers/leagueMatch";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  league: leagueRouter,
  teamUser: teamUserRouter,
  leagueUser: leagueUserRouter,
  leagueMatch: leagueMatchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
