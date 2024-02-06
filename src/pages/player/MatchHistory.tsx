import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/utils/api";
import { updateEloRating } from "@/utils/elo";

export default function MatchHistory({ id }: { id: string }) {
  const { data, isLoading } = api.match.findAllById.useQuery({ id });

  if (data === undefined || isLoading) return null;

  return (
    <Table className="w-[min(500px,100%)]">
      <TableHeader>
        <TableRow>
          <TableHead>P1 ELO</TableHead>
          <TableHead>P2 ELO</TableHead>
          <TableHead>Resultat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((match) => (
          <TableRow key={match.id}>
            <TableCell className="font-medium">{match.prePlayer1Elo}</TableCell>
            <TableCell className="font-medium">{match.prePlayer2Elo}</TableCell>
            <TableCell
              className={
                id === match.player1Id ? "text-green-500" : "text-red-500"
              }
            >
              {id === match.player1Id
                ? "+" +
                  (updateEloRating(
                    match.prePlayer1Elo,
                    match.prePlayer2Elo,
                    "player111",
                  )[0] -
                    match.prePlayer1Elo)
                : updateEloRating(
                    match.prePlayer1Elo,
                    match.prePlayer2Elo,
                    "player111",
                  )[1] - match.prePlayer2Elo}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
