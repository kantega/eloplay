"use client";

import LeagueMatchCard from "@/components/leagueMatch/league-match-card";
import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function PlayerPage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
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
      <LeagueUserCard
        leagueUser={leagueUser}
        teamUser={teamUser}
        leagueName={league.name}
      />
    </div>
  );
}

function LeagueUserMatches() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.leagueMatch.getAllForUser.useQuery({
    leagueId,
    id: teamId,
  });
  if (isLoading || !data) return null;

  const sortedLeagueMatchesWithProfiles = data.leagueMatchesWithProfiles.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      <ul className="w-full">
        {sortedLeagueMatchesWithProfiles.map((leagueMatchWithProfiles) => {
          return (
            <li key={leagueMatchWithProfiles.match.id}>
              <LeagueMatchCard {...leagueMatchWithProfiles} />
            </li>
          );
        })}
      </ul>
      <span className="py-10" />
    </>
  );
}
