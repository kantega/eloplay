import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import TeamMemberList from "@/components/team/team-member-list";
import TeamLeagueList from "@/components/league/team-league-list";
import TeamName from "@/components/team/team-name";
import CreateLeagueForm from "@/components/league/create-league-form";

export default function PlayerPage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <TeamInfo />
    </div>
  );
}

function TeamInfo() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.team.findById.useQuery({
    id: teamId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Team not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <TeamName teamName={data.team.name} />
      <CreateLeagueForm />
      <TeamLeagueList />
      <TeamMemberList teamUsers={data.teamUsers} />
    </div>
  );
}
