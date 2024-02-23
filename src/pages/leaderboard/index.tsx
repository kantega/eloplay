"use client";

import { api } from "@/utils/api";
import { useContext, useState } from "react";
import Leaderboard from "@/components/leaderboard/leaderboard";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  getLocalStorageShouldFilterUnplayedPlayers,
  setLocalStorageShouldFilterUnplayedPlayers,
} from "@/components/leagueMatch/league-match-util";
import HeaderLabel from "@/components/header-label";

export default function Home() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const [showInactivePlayers, setShowInactivePlayers] = useState(
    getLocalStorageShouldFilterUnplayedPlayers(),
  );
  // todo: bug cant set value and read value

  const { data, isLoading } = api.leagueUser.findAllByLeagueId.useQuery({
    leagueId,
    teamId,
  });
  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.find.useQuery({ leagueId, teamId });

  if (isLoading || !data) return null;
  if (leagueIsLoading || !leagueData) return null;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={leagueData.name} label="LEADERBOARD" />
      <FilterUnplayedPlayers
        shouldFilterUnplayedPlayers={showInactivePlayers}
        setShouldFilterUnplayedPlayers={setShowInactivePlayers}
      />
      <Leaderboard
        leagueUsers={data.leagueUsersAndTeamUsers}
        showInactivePlayers={showInactivePlayers}
      />
    </div>
  );
}

function FilterUnplayedPlayers({
  shouldFilterUnplayedPlayers,
  setShouldFilterUnplayedPlayers,
}: {
  shouldFilterUnplayedPlayers: boolean;
  setShouldFilterUnplayedPlayers: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="airplane-mode"
        checked={shouldFilterUnplayedPlayers}
        onCheckedChange={(value: boolean) => {
          setShouldFilterUnplayedPlayers(value);
          setLocalStorageShouldFilterUnplayedPlayers(value);
        }}
      />
      <Label htmlFor="airplane-mode">Show inactive players</Label>
    </div>
  );
}
