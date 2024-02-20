import {
  type TeamUser,
  type TableTennisPlayer,
  type LeagueUser,
} from "@prisma/client";

export const sortPlayersByName = (players: TableTennisPlayer[]) => {
  return players.sort(sortPlayerByName);
};

export const sortPlayerByName = (
  a: TableTennisPlayer,
  b: TableTennisPlayer,
) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
};

//todo: move... wrong place
export interface TeamUserWithLeagueUser {
  teamUser: TeamUser;
  leagueUser: LeagueUser;
}

export const sortTeamUsersByGamerTag = (players: TeamUserWithLeagueUser[]) => {
  return players.sort(sortTeamUserByGamerTag);
};

export const sortTeamUserByGamerTag = (
  a: TeamUserWithLeagueUser,
  b: TeamUserWithLeagueUser,
) => {
  if (a.teamUser.gamerTag > b.teamUser.gamerTag) return 1;
  if (a.teamUser.gamerTag < b.teamUser.gamerTag) return -1;
  return 0;
};
