import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TableTennisPlayer } from "@prisma/client";

export default function Leaderboard({ data }: { data: TableTennisPlayer[] }) {
  data.sort(sortPlayers);
  return (
    <Table>
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
          <TableRow key={player.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.office}</TableCell>
            <TableCell>{player.elo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const sortPlayers = (playerA: TableTennisPlayer, playerB: TableTennisPlayer) =>
  playerB.elo - playerA.elo;
