import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type TeamUser, type LeagueUser } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getLatestEloList } from "@/utils/match";
import MinityrLeagueMatchHistory from "../leagueMatch/minityr-league-match-history";
import MinityrStreakSymbol from "../leagueMatch/minityr-streak-symbol";

export default function Leaderboard({
  data,
  shouldFilterUnplayedPlayers,
}: {
  data: { leagueUser: LeagueUser; teamUser: TeamUser }[];
  shouldFilterUnplayedPlayers: boolean;
}) {
  const router = useRouter();

  data.sort(sortPlayers);
  const newData = data.filter((player) =>
    shouldFilterUnplayedPlayers ? player.leagueUser.matchCount > 0 : true,
  );

  return (
    <Table className="w-[min(500px,100%)]">
      <TableBody>
        {newData.map((player, index) => {
          const eloGainList = getLatestEloList(player.leagueUser.latestEloGain);
          return (
            <TableRow
              key={player.leagueUser.id}
              onClick={() =>
                router.push("/new/leagueUser/" + player.leagueUser.id)
              }
            >
              <TableCell className="px-0">
                <div className="relative w-10 overflow-hidden rounded-full">
                  <p className="absolute top-1 z-50 text-3xl text-primary">
                    {index + 1}
                  </p>
                  <div className="absolute z-30 h-full w-full bg-[#333a]" />
                  <Image
                    className="rounded-full"
                    src={player.teamUser.image}
                    alt="Team user profile image"
                    width={40}
                    height={40}
                    quality={100}
                  />
                </div>
              </TableCell>
              <TableCell className="px-0">
                <div className="flex flex-col items-start">
                  <p className="text-xl">{player.teamUser.gamerTag}</p>
                  <div className="flex items-center space-x-2">
                    {<MinityrLeagueMatchHistory eloList={eloGainList} />}
                    <p className="text-sm text-gray-500">
                      {player.leagueUser.matchCount -
                        player.leagueUser.matchLossCount}
                      -{player.leagueUser.matchLossCount}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-0">
                {Math.abs(player.leagueUser.streak) > 3 && (
                  <MinityrStreakSymbol streak={player.leagueUser.streak} />
                )}
              </TableCell>
              <TableCell className="px-0">
                <div className="flex flex-col items-end">
                  <p className="text-xl">{player.leagueUser.elo}</p>
                  <p className="text-sm text-gray-500">ELO</p>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const sortPlayers = (
  playerA: { leagueUser: LeagueUser; teamUser: TeamUser },
  playerB: { leagueUser: LeagueUser; teamUser: TeamUser },
) => playerB.leagueUser.elo - playerA.leagueUser.elo;
