"use client";

import { useSession } from "next-auth/react";
import CreateTeamForm from "../components/team/create-team-form";
import JoinTeamForm from "../components/team/join-team-form";
import HeaderLabel from "@/components/header-label";
import { useContext, useEffect } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { Separator } from "@/components/ui/separator";

export default function CreateOrJoinTeamPage() {
  const { data: sessionData } = useSession();
  const { teamId, setTeamId } = useContext(TeamContext);
  const { data, isLoading } = api.team.getAll.useQuery();

  useEffect(() => {
    if (!isLoading && !!data && !!data[0]) setTeamId(data[0].id);
  }, [data, isLoading, setTeamId, teamId]);

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
