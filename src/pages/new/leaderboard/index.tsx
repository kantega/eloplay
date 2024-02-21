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

export default function Home() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const [shouldFilterUnplayedPlayers, setShouldFilterUnplayedPlayers] =
    useState(getLocalStorageShouldFilterUnplayedPlayers());
  // todo: bug cant set value and read value

  const { data, isLoading } = api.leagueUser.findAllByLeagueId.useQuery({
    leagueId,
    id: teamId,
  });
  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.find.useQuery({ leagueId, id: teamId });

  if (isLoading || !data) return null;
  if (leagueIsLoading || !leagueData) return null;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <span>
        <h2 className=" m-0 text-sm font-bold text-gray-500">Leaderboard</h2>
        <h1 className="m-0 text-4xl text-primary">{leagueData.name}</h1>
      </span>
      <FilterUnplayedPlayers
        shouldFilterUnplayedPlayers={shouldFilterUnplayedPlayers}
        setShouldFilterUnplayedPlayers={setShouldFilterUnplayedPlayers}
      />
      <Leaderboard
        data={data.leagueUsersAndTeamUsers}
        shouldFilterUnplayedPlayers={shouldFilterUnplayedPlayers}
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
      <Label htmlFor="airplane-mode">Remove unplayed players</Label>
    </div>
  );
}
