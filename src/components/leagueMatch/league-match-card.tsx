import { type LeagueMatch, type TeamUser } from "@prisma/client";
import { Separator } from "../ui/separator";
import TeamMatchProfile from "../teamUser/team-match-profile";
import { updateEloRating } from "@/utils/elo";

export default function LeagueMatchCard({
  match,
  winnerTeamUser,
  loserTeamUser,
}: {
  winnerTeamUser: TeamUser;
  loserTeamUser: TeamUser;
  match: LeagueMatch;
}) {
  const newElos = updateEloRating(match.preWinnerElo, match.preLoserElo);
  const winnerEloGain = "+" + (newElos[0] - match.preWinnerElo);
  const loserEloGain = newElos[1] - match.preLoserElo;

  return (
    <>
      <div className="flex w-full justify-between py-2">
        <div>
          <TeamMatchProfile
            teamUser={winnerTeamUser}
            preElo={match.preWinnerElo}
          />
          <TeamMatchProfile
            teamUser={loserTeamUser}
            preElo={match.preLoserElo}
          />
        </div>
        <div className="flex flex-col justify-around">
          <p className=" w-14 rounded bg-primary px-2 text-center">
            {winnerEloGain}
          </p>
          <p className=" w-14 rounded bg-destructive px-2 text-center">
            {loserEloGain}
          </p>
        </div>
      </div>
      <Separator className=" bg-background-tertiary" />
    </>
  );
}
