import { type LeagueMatch, type TeamUser } from "@prisma/client";

export interface LeagueMatchWithProfiles {
  winnerTeamUser: TeamUser;
  loserTeamUser: TeamUser;
  match: LeagueMatch;
}
