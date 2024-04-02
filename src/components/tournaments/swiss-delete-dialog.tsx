import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import LoadingSpinner from "../loader/loading";
import { useRouter } from "next/router";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";

export default function SwissDeleteDialog({
  children,
  tournamentId,
}: {
  children: React.ReactNode;
  tournamentId: string;
}) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const deleteTournament = api.swissTournament.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Tournament deleted!",
        variant: "success",
      });
      void router.push("/tournament");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;

      toast({
        title: "Error",
        description:
          errorMessage?.title ??
          errorMessage?.description ??
          "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Deletion of tournament can NOT be undone
          </DialogTitle>
        </DialogHeader>
        <h1>This will be deleted with the team itself:</h1>
        <ol className="list-disc">
          <li className="ml-8"> All matches in the tournament </li>
          <li className="ml-8"> All player data in the tournament </li>
          <li className="ml-8"> All statistics in the tournament </li>
        </ol>
        <Input
          type="text"
          placeholder="Type delete to activate delete button..."
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <DialogFooter>
          <Button
            className="w-full"
            disabled={
              value.toLowerCase() !== "delete" || deleteTournament.isLoading
            }
            type="submit"
            variant="destructive"
            onClick={() => {
              deleteTournament.mutate({
                teamId,
                leagueId,
                tournamentId,
              });
            }}
          >
            {deleteTournament.isLoading ? <LoadingSpinner /> : <TrashIcon />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
