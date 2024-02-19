import { createTRPCRouter } from "@/server/api/trpc";
import { playerRouter } from "./routers/oldTableTennis/player";
import { matchRouter } from "./routers/oldTableTennis/match";
import { teamRouter } from "./routers/team";
import { newPlayerRouter } from "./routers/newPlayer";
import { leagueRouter } from "./routers/league";
import { teamUserRouter } from "./routers/teamUser";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  league: leagueRouter,
  teamUser: teamUserRouter,
  newPlayer: newPlayerRouter,
  player: playerRouter,
  match: matchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
