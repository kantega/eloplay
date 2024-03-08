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

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {sortedSwissUsers.map((swissUser, index) => {
        const teamUser = teamUsers.find(
          (teamUser) => teamUser.userId === swissUser.userId,
        );
        if (!teamUser) return null;

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
