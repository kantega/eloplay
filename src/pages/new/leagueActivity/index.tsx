import LeagueMatchHistory from "@/components/leagueMatch/league-match-history";
import { api } from "@/utils/api";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";

export default function LeagueActivityPage() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);

  const { data: leagueData, isLoading: leagueIsLoading } =
    api.league.find.useQuery({ leagueId, id: teamId });

  if (leagueIsLoading || !leagueData) return null;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <span>
        <h2 className=" m-0 text-xs font-bold text-gray-500">ACTIVITY</h2>
        <h1 className="m-0 text-4xl text-primary">{leagueData.name}</h1>
      </span>
      <LeagueMatchHistory />
    </div>
  );
}
