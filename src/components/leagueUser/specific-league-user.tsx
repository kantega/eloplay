import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";
import LoadingSpinner from "../loading";

export default function SpecificLeagueUser({
  leagueUserId,
}: {
  leagueUserId: string;
}) {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueUser.getById.useQuery({
    leagueUserId,
    teamId,
  });
  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const { leagueUser, teamUser, league } = data;

  return (
    <LeagueUserCard
      leagueUser={leagueUser}
      teamUser={teamUser}
      leagueName={league.name}
    />
  );
}
