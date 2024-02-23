import {
  type LeagueUser,
  type LeagueMatch,
  type TeamUser,
} from "@prisma/client";

export interface LeagueMatchWithProfiles {
  winnerTeamUser: TeamUser;
  loserTeamUser: TeamUser;
  match: LeagueMatch;
}

export interface LeagueUserAndTeamUser {
  leagueUser: LeagueUser;
  teamUser: TeamUser;
}
