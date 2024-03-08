import {
  type SwissTournamentMatch,
  type SwissTournamentUser,
  type TeamUser,
} from "@prisma/client";
import TeamUserImage from "../teamUser/team-user-image";

export function SwissUserCard({
  teamUser,
  swissUser,
  match,
  index,
}: {
  teamUser: TeamUser;
  swissUser: SwissTournamentUser;
  match?: SwissTournamentMatch;
  index?: number;
}) {
  return (
    <div
      className={
        teamUser.userId === match?.winnerId
          ? "m-auto flex items-center gap-2 rounded border-2 border-primary bg-background-tertiary p-2"
          : "m-auto flex items-center gap-2 rounded p-2"
      }
    >
      <TeamUserImage image={teamUser.image} index={index} />
      <div className=" text-left">
        <p>{teamUser.gamerTag}</p>
        <span className="flex gap-2">
          <p className="text-gray-500">Points: </p>
          <p className="text-primary">{swissUser.score}</p>
        </span>
      </div>
    </div>
  );
}
