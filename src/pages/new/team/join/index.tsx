"use client";

import HeaderLabel from "@/components/header-label";
import JoinTeamForm from "../../../../components/team/join-team-form";

export default function PlayerPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={"Join Team"} />
      <JoinTeamForm />
    </div>
  );
}
