import { createTRPCRouter } from "@/server/api/trpc";
import { playerRouter } from "./routers/oldTableTennis/player";
import { matchRouter } from "./routers/oldTableTennis/match";
import { teamRouter } from "./routers/team";
import { leagueRouter } from "./routers/league";
import { teamUserRouter } from "./routers/teamUser";
import { leagueUserRouter } from "./routers/leagueUser";

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
  player: playerRouter,
  match: matchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
