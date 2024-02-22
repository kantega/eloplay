import { useSession } from "next-auth/react";
import CreateTeamForm from "../components/team/create-team-form";
import JoinTeamForm from "../components/team/join-team-form";
import HeaderLabel from "@/components/header-label";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";

export default function CreateOrJoinO() {
  const { data: sessionData } = useSession();

  if (!sessionData)
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        Sign in to see the leaderboard
      </div>
    );

  return (
    <div className="container flex h-full w-full flex-col items-start gap-12 px-4 py-4 ">
      <HeaderLabel headerText={"Join or create team"} label="ELOPLAY" />
      <JoinTeamForm />
      <GoToTeamFromTeamList />
      <CreateTeamForm />
    </div>
  );
}

function GoToTeamFromTeamList() {
  const { teamId } = useContext(TeamContext);
  const router = useRouter();

  if (teamId !== "") void router.push("/leaderboard");

  return <TeamList />;
}

function TeamList() {
  const { setTeamId } = useContext(TeamContext);
  const { data, isLoading } = api.team.findAll.useQuery();

  if (isLoading || !data) return null;
  if (data.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="m-0 text-2xl">Pick a team</h1>
      <ul className="w-full space-y-2">
        {data.map((team) => (
          <li key={team.id} className="w-full">
            <Button
              className="w-full text-xl text-background"
              onClick={() => {
                setTeamId(team.id);
              }}
            >
              {team.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
