import { type LeagueMatch, type TeamUser } from "@prisma/client";
import { z } from "zod";
import { type LeagueMatchWithProfiles } from "../leagueUser/league-user-radar-graph";

const localStorageKey = "shouldFilterUnplayedPlayers";
const defaultValue = false;

export const getLocalStorageShouldFilterUnplayedPlayers = () => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(localStorageKey);
    if (!value) return defaultValue;
    return z.boolean().parse(defaultValue);
  }
  return defaultValue;
};

// todo: bug cant set value and read value
export const setLocalStorageShouldFilterUnplayedPlayers = (value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }
};

export const getNiceDateString = (date: Date) => {
  return (
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  );
};

export const getNiceDateAndTimeString = (date: Date) => {
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

export function filterMatches({
  matches,
  searchQuery,
  winnerId,
}: {
  matches: {
    match: LeagueMatch;
    winnerTeamUser: TeamUser;
    loserTeamUser: TeamUser;
  }[];
  searchQuery: string;
  winnerId: string;
}) {
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
          winnerId !== match.match.winnerId
            ? match.winnerTeamUser.gamerTag.toLowerCase()
            : match.loserTeamUser.gamerTag.toLowerCase(),
      },
    ).state;
  });

  return filteredMatches;
}

export function bucketByDate(
  leagueMatchesWithProfiles: LeagueMatchWithProfiles[],
) {
  const buckets: Record<string, LeagueMatchWithProfiles[]> = {};
  leagueMatchesWithProfiles.forEach((leagueMatchWithProfiles) => {
    const date = getNiceDateString(leagueMatchWithProfiles.match.createdAt);
    if (!buckets[date]) {
      buckets[date] = [];
    }
    buckets[date]?.push(leagueMatchWithProfiles);
  });
  return buckets;
}

export function checkForSpecialDateText(date: string) {
  if (date === getNiceDateString(new Date())) {
    return "Today";
  }
  if (
    date ===
    getNiceDateString(new Date(new Date().valueOf() - 1000 * 60 * 60 * 24))
  ) {
    return "Yesterday";
  }
  return date;
}
