import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { type League, type LeagueUser, type TeamUser } from "@prisma/client";

export default function LeagueUserCards({
  leagueAndLeagueUsers,
  teamUser,
}: {
  leagueAndLeagueUsers: { league: League; leagueUser: LeagueUser }[];
  teamUser: TeamUser;
}) {
  return (
    <>
      <ul className="space-y-2">
        {leagueAndLeagueUsers.map((leagueAndLeagueUser) => {
          const { league, leagueUser } = leagueAndLeagueUser;
          if (league.matchCount === 0)
            return (
              <p
                key={leagueUser.id}
                className="rounded-sm bg-background-tertiary p-4"
              >
                No matches found for {league.name}{" "}
              </p>
            );
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
