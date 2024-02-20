import { type LeagueUser } from "@prisma/client";
import Link from "next/link";
import { Card } from "../ui/card";

export default function LeagueUserCard({
  leagueUser,
  leagueName,
  gamerTag,
}: {
  leagueUser: LeagueUser;
  gamerTag: string;
  leagueName: string;
}) {
  return (
    <Link href={`/new/leagueUser/${leagueUser.id}`}>
      <Card className="p-4">
        <p>{gamerTag}</p>
        <p>{leagueName}</p>
        <p>#{leagueUser.matchCount}</p>
        {leagueUser.latestEloGain.map((eloGain, index) => (
          <p key={index}>{eloGain}</p>
        ))}
      </Card>
    </Link>
  );
}
