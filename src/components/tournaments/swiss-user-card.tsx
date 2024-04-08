import { type SwissTournamentUser, type TeamUser } from "@prisma/client";
import TeamUserImage from "../teamUser/team-user-image";
import { cn } from "@/lib/utils";

export function SwissUserCard({
  teamUser,
  swissUser,
  index,
  className,
}: {
  teamUser: TeamUser;
  swissUser: SwissTournamentUser;
  index?: number;
  className?: string;
}) {
  const innerClassName = "flex items-center gap-2 rounded p-2";
  return (
    <div className={cn(innerClassName, className)}>
      <TeamUserImage image={teamUser.image} index={index} />
      <div className=" text-left">
        <p>{teamUser.gamerTag}</p>
        <span className="flex gap-2">
          <p className="text-white">Points: </p>
          <p className="text-white">{swissUser.score}</p>
        </span>
      </div>
    </div>
  );
}
