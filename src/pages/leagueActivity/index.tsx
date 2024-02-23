import LeagueMatchHistory from "@/components/leagueMatch/league-match-history";
import { api } from "@/utils/api";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import HeaderLabel from "@/components/header-label";
import LoadingSpinner from "@/components/loading";

export default function LeagueActivityPage() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);

  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.get.useQuery({ leagueId, teamId });

  if (leagueIsLoading) return <LoadingSpinner />;
  if (!leagueData) return null;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={leagueData.name} label="ACTIVITY" />
      <LeagueMatchHistory leagueName={leagueData.name} />
    </div>
  );
}
