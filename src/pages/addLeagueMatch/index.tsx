import HeaderLabel from "@/components/header-label";
import { api } from "@/utils/api";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import AddLeagueMatchForm from "@/components/leagueMatch/add-league-match-form";
import LoadingSpinner from "@/components/loader/loading";
import MessageBox from "@/components/message-box";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function AddMatchPage() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const { data, isLoading } = api.league.get.useQuery({
    teamId,
    leagueId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <MessageBox>No league was found.</MessageBox>;

  return (
    <div className="container flex h-full flex-col justify-center gap-4 px-4 py-4">
      <HeaderLabel headerText={data.name} label="ADD LEAGUE MATCH" />
      <AddLeagueMatchForm />
    </div>
  );
}
