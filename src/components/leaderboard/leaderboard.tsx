import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TeamUser, type LeagueUser } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Leaderboard({
  data,
}: {
  data: { leagueUser: LeagueUser; teamUser: TeamUser }[];
}) {
  const router = useRouter();

  data.sort(sortPlayers);
  return (
    <Table className="w-[min(500px,100%)]">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Office</TableHead>
          <TableHead>Elo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((player, index) => (
          <TableRow
            key={player.leagueUser.id}
            onClick={() =>
              router.push("/new/leagueUser/" + player.leagueUser.id)
            }
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">
              {player.teamUser.gamerTag}
            </TableCell>
            <TableCell>{player.leagueUser.elo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const sortPlayers = (
  playerA: { leagueUser: LeagueUser; teamUser: TeamUser },
  playerB: { leagueUser: LeagueUser; teamUser: TeamUser },
) => playerB.leagueUser.elo - playerA.leagueUser.elo;
