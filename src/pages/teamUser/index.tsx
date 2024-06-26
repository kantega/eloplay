import LeagueUserCards from "@/components/leagueUser/league-user-cards";
import LoadingSpinner from "@/components/loader/loading";
import TeamUserProfile from "@/components/teamUser/team-user-profile";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";

export default function TeamUserPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <PersonalLeaguePlayerCards />
    </div>
  );
}

function PersonalLeaguePlayerCards() {
  const teamId = useTeamId();
  const { data, isLoading } = api.leagueUser.getAll.useQuery({
    teamId,
  });
  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const { leagueAndLeagueUsers, teamUser } = data;

  return (
    <>
      <TeamUserProfile />
      <LeagueUserCards
        leagueAndLeagueUsers={leagueAndLeagueUsers}
        teamUser={teamUser}
      />
    </>
  );
}
