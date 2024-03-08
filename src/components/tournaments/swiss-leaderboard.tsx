import { type SwissTournamentUser, type TeamUser } from "@prisma/client";
import TeamUserImage from "../teamUser/team-user-image";

export default function SwissLeaderboard({
  swissUsers,
  teamUsers,
}: {
  swissUsers: SwissTournamentUser[];
  teamUsers: TeamUser[];
}) {
  const sortedSwissUsers = swissUsers.sort((a, b) => b.score - a.score);

  return (
    <>
      {sortedSwissUsers.map((swissUser, index) => {
        const teamUser = teamUsers.find(
          (teamUser) => teamUser.userId === swissUser.userId,
        );
        if (!teamUser) return null;

        return (
          <div className="flex gap-4 pl-10" key={swissUser.userId}>
            <TeamUserImage image={teamUser.image} index={index} />
            <div className="flex flex-col">
              <p className="text-xl">{teamUser.gamerTag}</p>
              <span className="flex gap-2">
                <p className="text-gray-600">Points: </p>
                <p className="text-primary">{swissUser.score}</p>
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
