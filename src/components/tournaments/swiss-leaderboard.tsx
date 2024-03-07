import { type SwissTournamentUser, type TeamUser } from "@prisma/client";
import Image from "next/image";

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
            <div className="relative w-10 overflow-hidden rounded-full">
              <p className="absolute top-1 z-30 text-3xl text-primary">
                {index + 1}
              </p>
              <div className="absolute z-20 h-full w-full bg-[#0000004D]" />
              <Image
                className="rounded-full"
                src={teamUser.image}
                alt="Team user profile image"
                width={40}
                height={40}
                quality={100}
              />
            </div>
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
