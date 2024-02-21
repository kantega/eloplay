"use client";

import HeaderLabel from "@/components/header-label";
import LeagueUserCard from "@/components/leagueUser/league-user-card";
import TeamProfile from "@/components/teamUser/team-profile";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function ProfilePage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
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
    <>
      <HeaderLabel headerText={teamUser.gamerTag} label="Team User Profile" />
      <TeamProfile />
      <ul className="space-y-2">
        {leagueAndLeagueUsers.map((leagueAndLeagueUser) => {
          const { league, leagueUser } = leagueAndLeagueUser;
          if (leagueUser.matchCount === 0) return null;
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
      <span className="py-6" />
    </>
  );
}
