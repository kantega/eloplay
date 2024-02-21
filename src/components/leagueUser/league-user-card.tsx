import { type LeagueUser } from "@prisma/client";
import Link from "next/link";
import { Card } from "../ui/card";
import { getLatestEloList } from "@/utils/match";

export default function LeagueUserCard({
  leagueUser,
  leagueName,
  gamerTag,
}: {
  leagueUser: LeagueUser;
  gamerTag: string;
  leagueName: string;
}) {
  const eloGainList = getLatestEloList(leagueUser.latestEloGain);

  return (
    <Link href={`/new/leagueUser/${leagueUser.id}`}>
      <Card className="p-4">
        <p>{gamerTag}</p>
        <p>{leagueName}</p>
        <p>#{leagueUser.matchCount}</p>
        {eloGainList.map((eloGain, index) => (
          <p key={index}>{eloGain}</p>
        ))}
      </Card>
    </Link>
  );
}
