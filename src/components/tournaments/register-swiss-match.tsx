import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  type TeamUser,
  type SwissTournamentMatch,
  type SwissTournamentUser,
} from "@prisma/client";
import LoadingSpinner from "../loading";
import MinorHeaderLabel from "../minor-header-label";
import { SwissMatchCard } from "./swiss-matches";

export default function RegisterSwissMatchDialog({
  children,
  match,
  teamUser1,
  teamUser2,
  swissUser1,
  swissUser2,
}: {
  children: React.ReactNode;
  match: SwissTournamentMatch;
  teamUser1: TeamUser;
  teamUser2: TeamUser;

  swissUser1: SwissTournamentUser;
  swissUser2: SwissTournamentUser;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [winnerId, setWinnerId] = useState("");
  const ctx = api.useUtils();
  const registerMatch = api.swissTournament.registerMatchResult.useMutation({
    onSuccess: async () => {
      void ctx.swissTournament.get.invalidate({
        teamId: match.teamId,
        leagueId: match.leagueId,
        tournamentId: match.tournamentId,
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
        <div className="flex flex-col gap-8">
          <MinorHeaderLabel headerText="Select winner" />
          <SwissMatchCard
            match={match}
            teamUser1={teamUser1}
            teamUser2={teamUser2}
            swissUser1={swissUser1}
            swissUser2={swissUser2}
          />
          <Button
            variant={teamUser1.userId === winnerId ? "tertiary" : "outline"}
            onClick={() => setWinnerId(teamUser1.userId)}
          >
            {teamUser1.gamerTag}
          </Button>
          <Button
            variant={teamUser2.userId === winnerId ? "tertiary" : "outline"}
            onClick={() => setWinnerId(teamUser2.userId)}
          >
            {teamUser2.gamerTag}
          </Button>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            disabled={winnerId === "" || registerMatch.isLoading}
            type="submit"
            onClick={() => {
              registerMatch.mutate({
                matchId: match.id,
                winnerId,
                teamId: match.teamId,
                leagueId: match.leagueId,
                tournamentId: match.tournamentId,
              });
            }}
          >
            {registerMatch.isLoading ? <LoadingSpinner /> : "Register result"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
