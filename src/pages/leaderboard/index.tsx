"use client";

import { api } from "@/utils/api";
import { useContext, useState } from "react";
import Leaderboard from "@/components/leaderboard/leaderboard";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { getLocalStorageShowInactivePlayers } from "@/components/leagueMatch/league-match-util";
import HeaderLabel from "@/components/header-label";
import ShowInactivePlayersToggle from "@/components/leagueMatch/show-inactive-players-toggle";
import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";

export default function Home() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const [showInactivePlayers, setShowInactivePlayers] = useState(
    getLocalStorageShowInactivePlayers(),
  );
  // todo: bug cant set value and read value

  const { data, isLoading } = api.leagueUser.getAllByLeagueId.useQuery({
    leagueId,
    teamId,
  });
  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.get.useQuery({ leagueId, teamId });

  if (isLoading || leagueIsLoading) return <LoadingSpinner />;
  if (!data || data.leagueUsersAndTeamUsers.length === 0 || !leagueData)
    return (
      <MessageBox>
        No league was found.
        <br />
        You should select a league or create a new one.
      </MessageBox>
    );

  console.log(leagueData);

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={leagueData.name} label="LEADERBOARD" />
      <ShowInactivePlayersToggle
        showInactivePlayers={showInactivePlayers}
        setShowInactivePlayers={setShowInactivePlayers}
      />
      <Leaderboard
        leagueUsers={data.leagueUsersAndTeamUsers}
        showInactivePlayers={showInactivePlayers}
      />
    </div>
  );
}
