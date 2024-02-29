import { latestEloGainSchema } from "@/server/api/routers/leagueMatch/league-match-types";
import { type RoleText } from "@/server/types/roleTypes";
import { type TeamUser } from "@prisma/client";

export interface TeamMemberProps extends TeamUser {
  role: RoleText;
}

export function filterTeamUsers(
  members: TeamMemberProps[],
  searchQuery: string,
) {
  const letters = searchQuery.split("");

  const filteredTeamUsers = members.filter((member) => {
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

  return filteredTeamUsers.reverse();
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
