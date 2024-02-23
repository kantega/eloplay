"use client";

import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";
import { filterMatches } from "./league-match-util";
import LeagueUserRivals from "../leagueUser/league-user-rivals";
import LeagueUserRadarGraph from "../leagueUser/league-user-radar-graph";
import LeagueMatchHistoryByDate from "./league-match-history-by-date";
import LoadingSpinner from "../loading";

export default function LeagueUserMatchHistory({
  leagueUserId,
  searchQuery,
}: {
  leagueUserId: string;
  searchQuery: string;
}) {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data: leagueUserData, isLoading: leagueUserIsLoading } =
    api.leagueUser.getById.useQuery({
      leagueUserId,
      teamId,
    });
  const { data, isLoading } = api.leagueMatch.getAllByLeagueUserId.useQuery({
    leagueUserId,
    leagueId,
    teamId,
  });

  if (isLoading || leagueUserIsLoading) return <LoadingSpinner />;
  if (!leagueUserData || !data) return null;

  const filteredMatches = filterMatches({
    matches: data.leagueMatchesWithProfiles,
    searchQuery,
    winnerId: leagueUserData.leagueUser.userId,
  });

  const sortedLeagueMatchesWithProfiles = filteredMatches.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      <LeagueUserRivals
        userId={leagueUserData.leagueUser.userId}
        leagueMatchesWithProfiles={sortedLeagueMatchesWithProfiles}
      />
      <LeagueUserRadarGraph
        userId={leagueUserData.leagueUser.userId}
        leagueMatchesWithProfiles={sortedLeagueMatchesWithProfiles}
      />
      <LeagueMatchHistoryByDate
        sortedLeagueMatchesWithProfiles={sortedLeagueMatchesWithProfiles}
      />
    </>
  );
}
