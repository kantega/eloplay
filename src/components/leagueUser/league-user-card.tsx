import { type TeamUser, type LeagueUser } from "@prisma/client";
import Link from "next/link";
import { Card } from "../ui/card";
import { getLatestEloList } from "@/utils/match";
import MinityrLeagueMatchHistory from "../leagueMatch/minityr-league-match-history";
import Image from "next/image";

export default function LeagueUserCard({
  leagueUser,
  leagueName,
  teamUser,
}: {
  leagueUser: LeagueUser;
  teamUser: TeamUser;
  leagueName: string;
}) {
  const eloGainList = getLatestEloList(leagueUser.latestEloGain);

  return (
    <Link href={`/new/leagueUser/${leagueUser.id}`} className="w-96">
      <Card className="w-96 space-y-4 p-4">
        <div>
          <span className="flex flex-row items-end gap-2">
            <p className="text-md">{leagueName}</p>
            <p className="text-xs text-gray-500">League</p>
          </span>
        </div>
        <div className="flex w-full gap-4">
          <div>
            <Image
              className="rounded-full"
              src={teamUser.image}
              alt="Team user profile image"
              width={60}
              height={60}
              quality={100}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-2xl">{teamUser.gamerTag}</p>
            <span className="flex flex-row items-end justify-end gap-2">
              <p className="text-lg">{leagueUser.elo}</p>
              <p className="text-sm text-gray-500">ELO</p>
            </span>
          </div>
        </div>
        <MinityrLeagueMatchHistory
          eloList={eloGainList}
          length={eloGainList.length}
        />
        <div className="flex justify-between">
          <StatsText
            value={leagueUser.matchCount - leagueUser.matchLossCount}
            label="wins"
          />
          <StatsText value={leagueUser.matchLossCount} label="losses" />
          <StatsText
            value={
              Math.round(
                ((leagueUser.matchCount - leagueUser.matchLossCount) /
                  leagueUser.matchCount) *
                  100,
              ) + "%"
            }
            label="winrate"
          />
          <StatsText value={leagueUser.streak} label="streak" />
        </div>
      </Card>
    </Link>
  );
}

function StatsText({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <span className="flex flex-col items-center justify-center">
      <p className="text-2xl">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </span>
  );
}
