"use client";

import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import { Suspense, useState } from "react";
import LeagueMatchHistoryByDate from "./league-match-history-by-date";
import LoadingSpinner from "../loader/loading";
import MessageBox from "../message-box";
import AnimationOnScroll from "./animation-on-scroll";
import { type LeagueMatchWithProfiles } from "../leagueUser/league-user-types";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { Skeleton } from "../ui/skeleton";

export default function LeagueMatchHistory() {
  const numberOfPlaceholders = 5;

  return (
    <Suspense
      fallback={new Array<number>(numberOfPlaceholders).fill(0).map((index) => (
        <Skeleton className="h-[10vh] w-full" key={index} />
      ))}
    >
      <LeagueMatchHistoryContent />
    </Suspense>
  );
}

function LeagueMatchHistoryContent() {
  const [listToShow, setListToShow] = useState<LeagueMatchWithProfiles[]>([]);
  const [page, setPage] = useState(0);
  const leagueId = useLeagueId();
  const teamId = useTeamId();
  const [data, allPostsQuery] =
    api.leagueMatch.getAllInfinite.useSuspenseInfiniteQuery(
      {
        limit: 10,
        leagueId,
        teamId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { fetchNextPage } = allPostsQuery;

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

  const sortedLeagueMatchesWithProfiles = listToShow.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      {sortedLeagueMatchesWithProfiles.length === 0 && page > 0 && (
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
