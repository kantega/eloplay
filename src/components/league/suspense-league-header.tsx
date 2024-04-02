import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import HeaderLabel from "../header-label";

export function SuspenseLeagueHeader({ label }: { label: string }) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const [data] = api.league.get.useSuspenseQuery({ leagueId, teamId });

  return <HeaderLabel headerText={data?.name ?? ""} label={label} />;
}
