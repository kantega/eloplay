import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { type League, type LeagueUser, type TeamUser } from "@prisma/client";
import MessageBox from "../message-box";

export default function LeagueUserCards({
  leagueAndLeagueUsers,
  teamUser,
}: {
  leagueAndLeagueUsers: { league: League; leagueUser: LeagueUser }[];
  teamUser: TeamUser;
}) {
  leagueAndLeagueUsers.sort((a, b) => {
    return b.leagueUser.matchCount - a.leagueUser.matchCount;
  });

  if (leagueAndLeagueUsers.length === 0) {
    return <MessageBox>No league were found.</MessageBox>;
  }

  return (
    <>
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
      <span className="py-6" />
    </>
  );
}
