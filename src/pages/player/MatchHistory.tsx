import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Minus, Plus, TrashIcon } from "lucide-react";
import { sortMatchesByDate } from "@/utils/match";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { type TableTennisMatch } from "@prisma/client";

export default function MatchHistory({ id }: { id: string }) {
  const ctx = api.useContext();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = api.match.findAllById.useQuery({ id });
  const deleteMatch = api.match.delete.useMutation({
    onSuccess: () => ctx.match.findAllById.invalidate({ id }),
  });

  if (!data || isLoading) return null;

  const filteredMatches = filterMatches(data, searchQuery);

  return (
    <>
      <Input
        placeholder="search for opponent..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
      />
      <Table className="w-[min(500px,100%)]">
        <TableHeader>
          <TableRow>
            <TableHead>Vinner</TableHead>
            <TableHead>Taper</TableHead>
            <TableHead>
              <Plus color="limegreen" />
              <Minus color="red" />
            </TableHead>
            <TableHead>SLETT</TableHead>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <TrashIcon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Er du sikker på at du vil slette kampen?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="destructive"
                        onClick={() => {
                          deleteMatch.mutate({ id: match.id });
                        }}
                      >
                        <TrashIcon />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function filterMatches(matches: TableTennisMatch[], searchQuery: string) {
  // all letters in searchQuery must be in card.name,
  // does not matter what order they are in and does
  // not count for multiple instances of the same letter

  // const offices = ["oslo", "trondheim", "bergen"];

  // if (searchQuery === "") return matches;

  // if (offices.includes(searchQuery.toLowerCase()))
  //   return matches.filter(
  //     (match) =>
  //       match.office !== null &&
  //       match.office.toLowerCase() === searchQuery.toLowerCase(),
  //   );

  const letters = searchQuery.split("");

  const player1Matches = matches.filter((match) => {
    return letters.reduce(
      (acc, letter) => {
        if (!acc.state) return { state: acc.state, name: acc.name };
        const includesLetter = acc.name.includes(letter.toLowerCase());
        return {
          state: includesLetter,
          name: acc.name.replace(letter.toLowerCase(), ""),
        };
      },
      { state: true, name: match.player1Id.toLowerCase() },
    ).state;
  });

  const player2Matches = matches.filter((match) => {
    return letters.reduce(
      (acc, letter) => {
        if (!acc.state) return { state: acc.state, name: acc.name };
        const includesLetter = acc.name.includes(letter.toLowerCase());
        return {
          state: includesLetter,
          name: acc.name.replace(letter.toLowerCase(), ""),
        };
      },
      { state: true, name: match.player2Id.toLowerCase() },
    ).state;
  });

  return [...new Set(player1Matches.concat(player2Matches))].sort(
    sortMatchesByDate,
  );
}
