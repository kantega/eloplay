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
import { type LeagueMatch } from "@prisma/client";

export default function DeleteLeagueMatchDialog({
  children,
  leagueMatch,
}: {
  children: React.ReactNode;
  leagueMatch: LeagueMatch;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const ctx = api.useUtils();
  const deleteMatch = api.leagueMatch.delete.useMutation({
    onSuccess: async () => {
      // todo: bugfix: this is not making the ui rerender or fetch new data
      await ctx.leagueMatch.getAll.invalidate({
        teamId: leagueMatch.teamId,
        leagueId: leagueMatch.leagueId,
      });
      await ctx.leagueMatch.getAllByLeagueUserId.invalidate({
        teamId: leagueMatch.teamId,
        leagueUserId: leagueMatch.winnerId,
        leagueId: leagueMatch.leagueId,
      });
      await ctx.leagueMatch.getAllByLeagueUserId.invalidate({
        teamId: leagueMatch.teamId,
        leagueUserId: leagueMatch.loserId,
        leagueId: leagueMatch.leagueId,
      });
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant="ghost"
          className="m-0 flex h-fit w-full flex-col rounded-none border-0 p-0"
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Match</DialogTitle>
        </DialogHeader>
        {children}
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
              deleteMatch.mutate({
                teamId: leagueMatch.teamId,
                leagueMatchId: leagueMatch.id,
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
