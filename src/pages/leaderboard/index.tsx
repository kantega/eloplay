import Leaderboard from "@/components/leaderboard/leaderboard";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { LocalStorageToggle } from "@/components/ui-localstorage/localstorage-toggle";
import { useLocalBoolean } from "@/components/ui-localstorage/localstorage-utils";
import { LeagueHeader } from "@/components/league/league-header";

export default function LeaderboardPage() {
  const leagueId = useLeagueId();

  const localKey = leagueId + "showInactivePlayers";
  const [showInactivePlayers, setShowInactivePlayers] =
    useLocalBoolean(localKey);

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <LeagueHeader label={"LEADERBOARD"} />
      <LocalStorageToggle
        isToggled={showInactivePlayers}
        setIsToggled={setShowInactivePlayers}
        localStorageKey={localKey}
        label="Show inactive players"
      />
      <Leaderboard showInactivePlayers={showInactivePlayers} />
    </div>
  );
}
