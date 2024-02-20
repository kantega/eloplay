"use client";

import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      Welcome to personal profile page
      <SpecificLeaguePlayer leagueUserId={id} />
      <LeaguePlayerMatches leagueUserId={id} />
    </div>
  );
}

function SpecificLeaguePlayer({ leagueUserId }: { leagueUserId: string }) {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueUser.findById.useQuery({
    leagueUserId,
    id: teamId,
  });
  if (isLoading || !data) return null;

  const { leagueUser, teamUser, league } = data;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <h1>Personal League Player Card </h1>
      <LeagueUserCard
        leagueUser={leagueUser}
        gamerTag={teamUser.gamerTag}
        leagueName={league.name}
      />
      {/* todo: missing match list */}
    </div>
  );
}

function LeaguePlayerMatches({ leagueUserId }: { leagueUserId: string }) {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.leagueMatch.getAllById.useQuery({
    leagueUserId,
    leagueId,
    id: teamId,
  });

  if (isLoading || !data) return null;

  const { leagueMatches } = data;

  return (
    <ul>
      {leagueMatches.map((match) => (
        <li key={match.id}>
          {match.winnerId} vs. {match.loserId}
        </li>
      ))}
    </ul>
  );
}
