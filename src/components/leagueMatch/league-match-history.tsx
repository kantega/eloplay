"use client";

import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import { useState } from "react";
import LeagueMatchHistoryByDate from "./league-match-history-by-date";
import LoadingSpinner from "../loader/loading";
import MessageBox from "../message-box";
import AnimationOnScroll from "./animation-on-scroll";
import { type LeagueMatchWithProfiles } from "../leagueUser/league-user-types";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function LeagueMatchHistory() {
  const [listToShow, setListToShow] = useState<LeagueMatchWithProfiles[]>([]);
  const [page, setPage] = useState(0);
  const leagueId = useLeagueId();
  const teamId = useTeamId();
  const { data, isLoading, fetchNextPage } =
    api.leagueMatch.getAllInfinite.useInfiniteQuery(
      {
        limit: 10,
        leagueId,
        teamId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  if (!data || isLoading) return <LoadingSpinner />;

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

  // const handleFetchPreviousPage = () => {
  //   setPage((prev) => prev - 1);
  // };

  const sortedLeagueMatchesWithProfiles = listToShow.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      {sortedLeagueMatchesWithProfiles.length === 0 &&
        !isLoading &&
        page > 0 && (
          <MessageBox>
            No matches found.
            <br />
            Maybe you should play some games?
          </MessageBox>
        )}
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
