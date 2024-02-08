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

export function filterMatches(
  matches: TableTennisMatch[],
  searchQuery: string,
  id: string,
) {
  const letters = searchQuery.split("");

  const filteredMatches = matches.filter((match) => {
    return letters.reduce(
      (acc, letter) => {
        if (!acc.state) return { state: acc.state, name: acc.name };
        const includesLetter = acc.name.includes(letter.toLowerCase());
        return {
          state: includesLetter,
          name: acc.name.replace(letter.toLowerCase(), ""),
        };
      },
      {
        state: true,
        name:
          match.winner === id
            ? match.player2Id.toLowerCase()
            : match.player1Id.toLowerCase(),
      },
    ).state;
  });

  return filteredMatches.reverse();
}

export const getTime = (date: Date) => {
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return (
    hours +
    ":" +
    minutes +
    " " +
    date.getDate() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getFullYear()
  );
};
