import { useSession } from "next-auth/react";
import CreateTeamForm from "../components/team/create-team-form";
import JoinTeamForm from "../components/team/join-team-form";
import HeaderLabel from "@/components/header-label";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Separator } from "@/components/ui/separator";

export default function CreateOrJoinO() {
  const { data: sessionData } = useSession();
  useCheckForTeam();

  if (!sessionData)
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        Sign in to see the leaderboard
      </div>
    );

  return (
    <div className="container flex h-full w-full flex-col items-start gap-12 px-4 py-4 ">
      <HeaderLabel headerText={"Join team"} />
      <JoinTeamForm />
      <Separator className="w-full bg-background-tertiary" />
      <HeaderLabel headerText={"Create team"} />
      <CreateTeamForm />
    </div>
  );
}

function useCheckForTeam() {
  const { setTeamId } = useContext(TeamContext);
  const { data, isLoading } = api.team.getAll.useQuery();
  const { teamId } = useContext(TeamContext);
  const router = useRouter();

  if (teamId !== "") void router.push("/leaderboard");

  if (isLoading || !data) return null;
  if (data.length === 0) return null;
  if (!!data[0]) setTeamId(data[0].id);
  return null;
}
