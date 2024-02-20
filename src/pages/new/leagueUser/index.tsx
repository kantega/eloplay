"use client";

import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function PlayerPage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      Welcome to personal profile page
      <LeaguePlayer />
      <LeagueUserMatches />
    </div>
  );
}

function LeaguePlayer() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.leagueUser.get.useQuery({
    leagueId,
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
    </div>
  );
}

function LeagueUserMatches() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.leagueMatch.getAll.useQuery({
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
