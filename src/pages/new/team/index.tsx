import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import TeamMemberList from "@/components/team/team-member-list";
import TeamLeagueList from "@/components/league/team-league-list";
import TeamName from "@/components/team/team-name";
import CreateLeagueForm from "@/components/league/create-league-form";
import { userIsModerator } from "@/utils/role";

export default function PlayerPage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <TeamInfo />
    </div>
  );
}

function TeamInfo() {
  const { teamId, role } = useContext(TeamContext);
  const { data, isLoading } = api.team.findById.useQuery({
    id: teamId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Team not found</div>;

  return (
    <div className="flex w-full flex-col gap-8">
      <TeamName teamName={data.team.name} />
      {userIsModerator(role) && (
        <>
          <CreateLeagueForm />
          <TeamLeagueList />
        </>
      )}
      <TeamMemberList teamUsers={data.teamUsers} />
    </div>
  );
}
