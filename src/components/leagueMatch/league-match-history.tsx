"use client";

import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext, useState } from "react";
import LeagueMatchHistoryByDate from "./league-match-history-by-date";
import LoadingSpinner from "../loading";
import MessageBox from "../message-box";
import { type LeagueMatch, type TeamUser } from "@prisma/client";
import AnimationOnScroll from "./animation-on-scroll";

interface LeagueMatchWithProfiles {
  winnerTeamUser: TeamUser;
  loserTeamUser: TeamUser;
  match: LeagueMatch;
}

export default function LeagueMatchHistory({
  leagueName,
}: {
  leagueName: string;
}) {
  const [listToShow, setListToShow] = useState<LeagueMatchWithProfiles[]>([]);
  const [page, setPage] = useState(0);
  const { leagueId } = useContext(LeagueContext);
  const { teamId } = useContext(TeamContext);
  const { data, isLoading, fetchNextPage } =
    api.leagueMatch.getAllInifinte.useInfiniteQuery(
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

    setListToShow((prev) => {
      const newEntries = data?.pages[page]?.leagueMatchesWithProfiles.flatMap(
        (test) => test,
      );
      if (!newEntries) return prev;
      return [...prev, ...newEntries];
    });
  };

  // const handleFetchPreviousPage = () => {
  //   setPage((prev) => prev - 1);
  // };

  if (isLoading || !data) return <LoadingSpinner />;

  const sortedLeagueMatchesWithProfiles = listToShow.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      {sortedLeagueMatchesWithProfiles.length === 0 && (
        <MessageBox>
          No matches found for {leagueName}.
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
