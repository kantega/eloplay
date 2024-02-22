import { type LeagueMatch, type TeamUser } from "@prisma/client";
import { getRivalsData } from "./league-user-utils";

interface LeagueMatchWithProfiles {
  winnerTeamUser: TeamUser;
  loserTeamUser: TeamUser;
  match: LeagueMatch;
}

interface Props {
  userId: string;
  leagueMatchesWithProfiles: LeagueMatchWithProfiles[];
}

export default function LeagueUserRivals({
  userId,
  leagueMatchesWithProfiles,
}: Props) {
  const { nemesis, bestFriend } = getRivalsData(
    leagueMatchesWithProfiles,
    userId,
  );

  return (
    <span className="flex w-full flex-row flex-wrap justify-between gap-2 py-2">
      <h1 className="text-3xl"> 👼 {bestFriend?.subject.slice(0, 20)}</h1>
      <h1 className="text-3xl"> 😈 {nemesis?.subject}</h1>
    </span>
  );
}
