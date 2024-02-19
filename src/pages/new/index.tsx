import { useSession } from "next-auth/react";
import CreateTeamForm from "../../components/team/create-team-form";
import JoinTeamForm from "../../components/team/join-team-form";

export default function CreateOrJoinO() {
  const { data: sessionData } = useSession();

  if (!sessionData)
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        Sign in to see the leaderboard
      </div>
    );

  return (
    <div className="container flex h-full flex-col items-center justify-center gap-8 px-4 py-4 ">
      <CreateTeamForm />
      <JoinTeamForm />
    </div>
  );
}
