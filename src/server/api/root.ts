import { createTRPCRouter } from "@/server/api/trpc";
import { teamRouter } from "./routers/team/team";
import { leagueRouter } from "./routers/league/league";
import { teamUserRouter } from "./routers/teamUser";
import { leagueUserRouter } from "./routers/leagueUser";
import { leagueMatchRouter } from "./routers/leagueMatch/league-match";
import { swissTournamentRouter } from "./routers/swissTournament/swissTournament";

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
  swissTournament: swissTournamentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
