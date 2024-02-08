import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/utils/api";
import { matchResults, updateEloRating } from "@/utils/elo";
import { Info, InfoIcon, Minus, Plus } from "lucide-react";
import { filterMatches } from "@/utils/match";
import MatchDialog from "./MatchDialog";

export default function MatchHistory({
  id,
  searchQuery,
}: {
  id: string;
  searchQuery: string;
}) {
  const { data, isLoading } = api.match.findAllById.useQuery({ id });

  if (!data || isLoading) return null;

  const filteredMatches = filterMatches(data, searchQuery, id);

  return (
    <Table className="w-[min(500px,100%)]">
      <TableHeader>
        <TableRow>
          <TableHead>Vinner</TableHead>
          <TableHead>Taper</TableHead>
          <TableHead>
            <Plus color="limegreen" />
            <Minus color="red" />
          </TableHead>
          <TableHead>
            <InfoIcon />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMatches.map((match) => (
          <TableRow key={match.id}>
            <TableCell className="font-medium">
              {`${match.player1Id} (${match.prePlayer1Elo})`}
            </TableCell>
            <TableCell className="font-medium">
              {`${match.player2Id} (${match.prePlayer2Elo})`}
            </TableCell>
            <TableCell
              className={
                id === match.winner ? "text-green-500" : "text-red-500"
              }
            >
              {id === match.winner
                ? "+" +
                  (updateEloRating(
                    match.prePlayer1Elo,
                    match.prePlayer2Elo,
                    matchResults.player111,
                  )[0] -
                    match.prePlayer1Elo)
                : updateEloRating(
                    match.prePlayer1Elo,
                    match.prePlayer2Elo,
                    matchResults.player111,
                  )[1] - match.prePlayer2Elo}
            </TableCell>
            <TableCell>
              <MatchDialog match={match} id={id}>
                <Info />
              </MatchDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
