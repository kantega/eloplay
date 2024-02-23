import { type TeamUser, type LeagueUser } from "@prisma/client";
import Link from "next/link";
import { Card } from "../ui/card";
import { getLatestEloList } from "@/server/api/routers/leagueMatch/league-match-utils";
import MinityrLeagueMatchHistory from "../leagueMatch/minityr-league-match-history";
import Image from "next/image";
import { PingPongShower } from "../ping-pong-shower";
import { Badge } from "../ui/badge";
import LeagueUserEloGraph from "./league-user-elo-graph";

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
    <Link href={`/leagueUser/${leagueUser.id}`} className="w-96">
      <Card className="relative w-full space-y-4 overflow-hidden">
        {leagueUser.streak > 0 && <PingPongShower number={leagueUser.streak} />}
        <div className="relative w-full space-y-4 overflow-hidden px-4 py-2">
          <Badge className="absolute right-4 top-4 text-black">
            {leagueName}
          </Badge>
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
          <MinityrLeagueMatchHistory eloList={eloGainList} length={15} />
        </div>
        <div className="flex justify-between bg-background-secondary px-6 py-4">
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
          {/* todo: brukertest, vil vi ha negativ streak? */}
          <StatsText value={Math.max(leagueUser.streak, 0)} label="streak" />
        </div>
        <LeagueUserEloGraph leagueUserId={leagueUser.id} />
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
