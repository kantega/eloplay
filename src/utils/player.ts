import { type TableTennisPlayer } from "@prisma/client";

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
