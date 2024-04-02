import { api } from "@/utils/api";
import { Suspense, useState } from "react";
import Leaderboard from "@/components/leaderboard/leaderboard";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import LoadingSpinner from "@/components/loader/loading";
import { LocalStorageToggle } from "@/components/ui-localstorage/localstorage-toggle";
import { getLocalStorageToggleValue } from "@/components/ui-localstorage/localstorage-utils";
import { SuspenseLeagueHeader } from "@/components/league/suspense-league-header";

export default function LeaderboardPage() {
  const leagueId = useLeagueId();

  const localKey = leagueId + "showInactivePlayers";
  const [showInactivePlayers, setShowInactivePlayers] = useState(
    getLocalStorageToggleValue(localKey),
  );

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <Suspense fallback={<LoadingSpinner />}>
        <SuspenseLeagueHeader label={"LEADERBOARD"} />
      </Suspense>
      <LocalStorageToggle
        isToggled={showInactivePlayers}
        setIsToggled={setShowInactivePlayers}
        localStorageKey={localKey}
        label="Show inactive players"
      />
      <Suspense fallback={<LoadingSpinner />}>
        <SuspenseLeaderboard showInactivePlayers={showInactivePlayers} />
      </Suspense>
    </div>
  );
}

function SuspenseLeaderboard({
  showInactivePlayers,
}: {
  showInactivePlayers: boolean;
}) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const [data] = api.leagueUser.getAllByLeagueId.useSuspenseQuery({
    leagueId,
    teamId,
  });

  return (
    <Leaderboard
      leagueUsers={data.leagueUsersAndTeamUsers}
      showInactivePlayers={showInactivePlayers}
    />
  );
}
