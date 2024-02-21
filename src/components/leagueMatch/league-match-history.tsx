"use client";

import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function LeagueMatchHistory() {
  const { leagueId } = useContext(LeagueContext);
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueMatch.getAll.useQuery({
    leagueId,
    id: teamId,
  });

  if (isLoading || !data) return null;

  return (
    <ul>
      {data.leagueMatchesWithProfiles.map((match) => {
        return (
          <li key={match.match.id}>
            {match.winnerTeamUser.gamerTag} vs {match.loserTeamUser.gamerTag}
          </li>
        );
      })}
    </ul>
  );
}
