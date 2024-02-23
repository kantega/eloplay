import { latestEloGainSchema } from "@/server/api/routers/leagueMatch/league-match-types";
import { type RoleText } from "@/server/types/roleTypes";
import { type TableTennisMatch, type TeamUser } from "@prisma/client";

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

export interface TeamMemberProps extends TeamUser {
  role: RoleText;
}

export function filterTeamUsers(
  members: TeamMemberProps[],
  searchQuery: string,
) {
  const letters = searchQuery.split("");

  const filteredMatches = members.filter((member) => {
    return letters.reduce(
      (acc, letter) => {
        if (!acc.state) return { state: acc.state, gamerTag: acc.gamerTag };
        const includesLetter = acc.gamerTag.includes(letter.toLowerCase());
        return {
          state: includesLetter,
          gamerTag: acc.gamerTag.replace(letter.toLowerCase(), ""),
        };
      },
      {
        state: true,
        gamerTag: member.gamerTag?.toLowerCase() ?? "",
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

export const addEloToLatestEloList = (eloList: string, eloGain: number) => {
  const eloNumberList = latestEloGainSchema.parse(JSON.parse(eloList));

  eloNumberList.unshift(eloGain);
  if (eloNumberList.length > 30) eloNumberList.pop();

  return JSON.stringify(eloNumberList);
};

export const getLatestEloList = (eloList: string) =>
  latestEloGainSchema.parse(JSON.parse(eloList));

export const newLeagueUserStreak = ({
  streak,
  add,
}: {
  streak: number;
  add: number;
}) => {
  if (streak > 0 && add > 0) return streak + add;
  if (streak < 0 && add < 0) return streak + add;
  return add;
};
