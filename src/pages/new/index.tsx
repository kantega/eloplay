import { useSession } from "next-auth/react";
import CreateOrganisationForm from "./CreateOrganisationForm";
import JoinOrganisationForm from "./JoinOrganisationForm";

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
      <CreateOrganisationForm />
      <JoinOrganisationForm />
    </div>
  );
}