import LeagueMatchHistory from "@/components/leagueMatch/league-match-history";
import { api } from "@/utils/api";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import HeaderLabel from "@/components/header-label";
import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function LeagueActivityPage() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.get.useQuery({ leagueId, teamId });

  if (leagueIsLoading) return <LoadingSpinner />;
  if (!leagueData) return <MessageBox>No league was found.</MessageBox>;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={leagueData.name} label="ACTIVITY" />
      <LeagueMatchHistory leagueName={leagueData.name} />
    </div>
  );
}
