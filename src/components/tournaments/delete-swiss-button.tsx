import { type SwissTournament } from "@prisma/client";
import TournamentModerator from "../auhtVisibility/tournament-moderator";
import SwissDeleteDialog from "./swiss-delete-dialog";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

export function DeleteTournamentButton({
  tournament,
}: {
  tournament: SwissTournament;
}) {
  const { userId: ownerId, id: tournamentId } = tournament;

  return (
    <TournamentModerator ownerId={ownerId}>
      <SwissDeleteDialog tournamentId={tournamentId}>
        <Button
          className="absolute bottom-0 right-0 w-fit scale-50 hover:bg-background-tertiary"
          variant="destructive"
          size="sm"
        >
          <Trash2Icon />
        </Button>
      </SwissDeleteDialog>
    </TournamentModerator>
  );
}
