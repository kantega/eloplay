"use client";

import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { Suspense, useState } from "react";
import { filterMatches } from "./league-match-util";
import LeagueUserRivals from "../leagueUser/league-user-rivals";
import LeagueUserRadarGraph from "../leagueUser/league-user-radar-graph";
import LeagueMatchHistoryByDate from "./league-match-history-by-date";
import LoadingSpinner from "../loader/loading";
import AnimationOnScroll from "./animation-on-scroll";
import { type LeagueMatchWithProfiles } from "../leagueUser/league-user-types";
import { SuspenseFallbackMatchHistory } from "./league-match-history";

export default function LeagueUserMatchHistory({
  leagueUserId,
  searchQuery,
}: {
  leagueUserId: string;
  searchQuery: string;
}) {
  return (
    <Suspense fallback={<SuspenseFallbackMatchHistory />}>
      <LeagueUserMatchHistoryContent
        leagueUserId={leagueUserId}
        searchQuery={searchQuery}
      />
    </Suspense>
  );
}

function LeagueUserMatchHistoryContent({
  leagueUserId,
  searchQuery,
}: {
  leagueUserId: string;
  searchQuery: string;
}) {
  const [listToShow, setListToShow] = useState<LeagueMatchWithProfiles[]>([]);
  const [, setPage] = useState(0);
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const [leagueUserData] = api.leagueUser.getById.useSuspenseQuery({
    leagueUserId,
    teamId,
  });
  const [data, query] =
    api.leagueMatch.getAllInfiniteByLeagueUserId.useSuspenseInfiniteQuery(
      {
        limit: 10,
        leagueUserId,
        leagueId,
        teamId,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  const { fetchNextPage } = query;

  if (!data || !leagueUserData) return null;

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);

    setListToShow(() => {
      const test = data.pages.reduce((prev, curr) => {
        return [...prev, ...curr.leagueMatchesWithProfiles];
      }, [] as LeagueMatchWithProfiles[]);

      return Array.from(new Set([...test]));
    });
  };

  const filteredMatches = filterMatches({
    matches: listToShow,
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
      <AnimationOnScroll
        classNameInView={"p-2 flex justify-center items-center"}
        classNameNotInView={"p-2 flex justify-center items-center"}
        functionToCall={handleFetchNextPage}
      >
        <LoadingSpinner />
      </AnimationOnScroll>
    </>
  );
}
