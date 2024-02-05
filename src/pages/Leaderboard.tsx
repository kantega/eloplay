import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Player } from "@prisma/client";

export default function Leaderboard({ data }: { data: Player[] }) {
  data.sort(sortPlayers);
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank position</TableHead>
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

const sortPlayers = (playerA: Player, playerB: Player) => {
  return playerB.elo - playerA.elo;
};
