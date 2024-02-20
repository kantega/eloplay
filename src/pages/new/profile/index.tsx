"use client";

import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function ProfilePage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      Welcome to personal profile page
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

  const { leagueAndLeagueUsers, gamerTag } = data;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <h1>Personal League Player Cards</h1>
      <ul>
        {leagueAndLeagueUsers.map((leagueAndLeagueUser) => {
          const { league, leagueUser } = leagueAndLeagueUser;
          return (
            <li key={leagueUser.id}>
              <LeagueUserCard
                leagueUser={leagueUser}
                gamerTag={gamerTag}
                leagueName={league.name}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
