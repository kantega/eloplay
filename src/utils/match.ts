import { type TableTennisMatch } from "@prisma/client";

export const sortMatchesByDate = (a: TableTennisMatch, b: TableTennisMatch) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

export const getMatchStats = (matches: TableTennisMatch[], id: string) => {
  const winrate = Math.ceil(
    (matches.filter((match) => match.winner === id).length / matches.length) *
      100,
  );
  let isWinstreaking = true;
  const winstreak = matches.reduce((acc, match) => {
    if (match.winner === id && isWinstreaking) {
      return acc + 1;
    } else {
      isWinstreaking = false;
      return acc;
    }
  }, 0);
  return { winrate, winstreak };
};
