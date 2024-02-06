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
import { updateEloRating } from "@/utils/elo";
import { Minus, Plus, TrashIcon } from "lucide-react";

export default function MatchHistory({ id }: { id: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.match.findAllById.useQuery({ id });
  const deleteMatch = api.match.delete.useMutation({
    onSuccess: () => ctx.match.findAllById.invalidate({ id }),
  });

  if (data === undefined || isLoading) return null;

  return (
    <Table className="w-[min(500px,100%)]">
      <TableHeader>
        <TableRow>
          <TableHead>ELO vinner</TableHead>
          <TableHead>ELO taper</TableHead>
          <TableHead>
            <Plus color="limegreen" />
            <Minus color="red" />
          </TableHead>
          <TableHead>SLETT</TableHead>
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
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
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
  );
}
