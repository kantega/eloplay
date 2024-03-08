import { api } from "@/utils/api";
import { useState } from "react";
import Leaderboard from "@/components/leaderboard/leaderboard";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import HeaderLabel from "@/components/header-label";
import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import {
  LocalStorageToggle,
  getLocalStorageToggleValue,
} from "@/components/localstorage-toggle";

export default function LeaderboardPage() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const localKey = leagueId + "showInactivePlayers";
  const [showInactivePlayers, setShowInactivePlayers] = useState(
    getLocalStorageToggleValue(localKey),
  );

  const { data, isLoading } = api.leagueUser.getAllByLeagueId.useQuery({
    leagueId,
    teamId,
  });
  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.get.useQuery({ leagueId, teamId });

  if (isLoading || leagueIsLoading) return <LoadingSpinner />;
  if (!data || data.leagueUsersAndTeamUsers.length === 0 || !leagueData)
    return <MessageBox>No league was found.</MessageBox>;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={leagueData.name} label="LEADERBOARD" />
      <LocalStorageToggle
        isToggled={showInactivePlayers}
        setIsToggled={setShowInactivePlayers}
        localStorageKey={localKey}
        label="Show inactive players"
      />
      <Leaderboard
        leagueUsers={data.leagueUsersAndTeamUsers}
        showInactivePlayers={showInactivePlayers}
      />
    </div>
  );
}
