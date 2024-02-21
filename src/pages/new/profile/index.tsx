"use client";

import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function ProfilePage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <PersonalLeaguePlayerCards />
    </div>
  );
}

function PersonalLeaguePlayerCards() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueUser.findAll.useQuery({
    id: teamId,
  });
  if (isLoading || !data) return null;

  const { leagueAndLeagueUsers, teamUser } = data;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <ul className="space-y-2">
        {leagueAndLeagueUsers.map((leagueAndLeagueUser) => {
          const { league, leagueUser } = leagueAndLeagueUser;
          return (
            <li key={leagueUser.id}>
              <LeagueUserCard
                leagueUser={leagueUser}
                teamUser={teamUser}
                leagueName={league.name}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
