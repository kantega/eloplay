import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function SpecificLeagueUser({
  leagueUserId,
}: {
  leagueUserId: string;
}) {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueUser.findById.useQuery({
    leagueUserId,
    teamId,
  });
  if (isLoading || !data) return null;

  const { leagueUser, teamUser, league } = data;

  return (
    <LeagueUserCard
      leagueUser={leagueUser}
      teamUser={teamUser}
      leagueName={league.name}
    />
  );
}
