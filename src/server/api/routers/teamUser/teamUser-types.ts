import { type TeamUser, type LeagueUser } from "@prisma/client";
export interface TeamUserAndLeagueUser {
  teamUser: TeamUser;
  leagueUser: LeagueUser;
}
