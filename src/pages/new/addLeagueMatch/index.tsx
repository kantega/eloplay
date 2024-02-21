import HeaderLabel from "@/components/header-label";
import AddMatchForm from "./AddMatchForm";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";

export default function AddMatch() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.league.find.useQuery({
    id: teamId,
    leagueId,
  });

  if (isLoading || !data) return null;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <HeaderLabel headerText={data.name} label="ADD LEAGUE MATCH" />
      <AddMatchForm />
    </div>
  );
}
