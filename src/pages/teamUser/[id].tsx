"use client";

import HeaderLabel from "@/components/header-label";
import LeagueUserCards from "@/components/leagueUser/league-user-cards";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <PersonalLeaguePlayerCards id={id} />
    </div>
  );
}

function PersonalLeaguePlayerCards({ id }: { id: string }) {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueUser.findAllById.useQuery({
    teamUserId: id,
    teamId,
  });
  if (isLoading || !data) return null;

  const { leagueAndLeagueUsers, teamUser } = data;

  return (
    <>
      <HeaderLabel headerText={teamUser.gamerTag} label="Team User Profile" />
      <LeagueUserCards
        leagueAndLeagueUsers={leagueAndLeagueUsers}
        teamUser={teamUser}
      />
    </>
  );
}
