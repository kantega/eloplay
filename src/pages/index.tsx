"use client";

import CreateTeamForm from "../components/team/create-team-form";
import JoinTeamForm from "../components/team/join-team-form";
import HeaderLabel from "@/components/header-label";
import { Separator } from "@/components/ui/separator";

export default function CreateOrJoinTeamPage() {
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
