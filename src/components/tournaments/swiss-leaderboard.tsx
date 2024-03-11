import { type SwissTournamentUser, type TeamUser } from "@prisma/client";
import { SwissUserCard } from "./swiss-user-card";

export default function SwissLeaderboard({
  swissUsers,
  teamUsers,
}: {
  swissUsers: SwissTournamentUser[];
  teamUsers: TeamUser[];
}) {
  const sortedSwissUsers = swissUsers.sort((a, b) => b.score - a.score);

  let previousScore = -1;
  let previousIndex = 0;
  return (
    <div className="flex w-full flex-col items-start justify-center">
      {sortedSwissUsers.map((swissUser, index) => {
        const teamUser = teamUsers.find(
          (teamUser) => teamUser.userId === swissUser.userId,
        );
        if (!teamUser) return null;

        const currentElo = swissUser.score;
        let currentEloIndex = index;

        if (previousScore === currentElo) {
          currentEloIndex = previousIndex;
        }
        previousIndex = currentEloIndex;
        previousScore = currentElo;

        return (
          <SwissUserCard
            key={swissUser.id}
            teamUser={teamUser}
            swissUser={swissUser}
            index={index}
          />
        );
      })}
    </div>
  );
}
