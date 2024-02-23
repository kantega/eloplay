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

import { type League } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { toast } from "../ui/use-toast";
import { TeamContext } from "@/contexts/teamContext/team-provider";

export default function LeagueDeleteDialog({
  league,
  children,
}: {
  league: League;
  children: React.ReactNode;
}) {
  const { teamId } = useContext(TeamContext);
  const [value, setValue] = useState("");
  const ctx = api.useUtils();
  const deleteLeagueMutate = api.league.delete.useMutation({
    onSuccess: async () => {
      void ctx.league.getAll.invalidate({ teamId });

      toast({
        title: "Success",
        description: "League has been deleted.",
        variant: "success",
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      console.log(errorMessage);

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
            Deletion of league can NOT be undone
          </DialogTitle>
        </DialogHeader>
        <h1>This will be deleted with the league itself:</h1>
        <ol>
          <li> All matches in the league </li>
          <li> All player data in the league </li>
          <li> All statistics in the league </li>
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
            disabled={value.toLowerCase() !== "delete"}
            type="submit"
            variant="destructive"
            onClick={() => {
              deleteLeagueMutate.mutate({
                leagueId: league.id,
                teamId,
              });
            }}
          >
            <TrashIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
