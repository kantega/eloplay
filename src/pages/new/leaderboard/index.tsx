import { api } from "@/utils/api";
import { useContext } from "react";
import Leaderboard from "@/components/leaderboard/leaderboard";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";

export default function Home() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.leagueUser.findAllByLeagueId.useQuery({
    leagueId,
    id: teamId,
  });

  if (isLoading || !data) return null;
  return (
    <div className="container flex h-full flex-col items-center justify-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl font-bold">Leaderboard</h1>
      <Leaderboard data={data.leagueUsersAndTeamUsers} />
    </div>
  );
}
