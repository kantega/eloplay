"use client";

import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";
import LeagueMatchHistoryByDate from "./league-match-history-by-date";

export default function LeagueMatchHistory() {
  const { leagueId } = useContext(LeagueContext);
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueMatch.getAll.useQuery({
    leagueId,
    teamId: teamId,
  });

  if (isLoading || !data) return null;

  const sortedLeagueMatchesWithProfiles = data.leagueMatchesWithProfiles.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      <LeagueMatchHistoryByDate
        sortedLeagueMatchesWithProfiles={sortedLeagueMatchesWithProfiles}
      />
      <span className="py-10" />
    </>
  );
}
