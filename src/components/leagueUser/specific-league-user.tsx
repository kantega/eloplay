import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import LoadingSpinner from "../loader/loading";

export default function SpecificLeagueUser({
  leagueUserId,
}: {
  leagueUserId: string;
}) {
  const teamId = useTeamId();
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
