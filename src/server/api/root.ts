import { createTRPCRouter } from "@/server/api/trpc";
import { playerRouter } from "./routers/player";
import { matchRouter } from "./routers/match";
import { organisationRouter } from "./routers/organisation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organisation: organisationRouter,
  player: playerRouter,
  match: matchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
