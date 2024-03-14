import HeaderLabel from "@/components/header-label";
import ListOfTournaments from "@/components/tournaments/list-of-tournaments";
import PickTournamentToCreate from "@/components/tournaments/pick-tournament-to-create-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TeamModerator from "@/components/auhtVisibility/team-moderator";

export default function TournamentPage() {
  return (
    <div className="container relative flex h-full flex-col justify-center gap-8 px-4 py-4">
      <HeaderLabel label="TOURNAMENT" headerText="Pick Tournament" />
      <TeamModerator>
        <PickTournamentToCreate>
          <Button variant="ghost" size="sm" className="absolute right-4 top-8">
            <PlusCircle className=" text-foreground" size={30} />
          </Button>
        </PickTournamentToCreate>
      </TeamModerator>
      <ListOfTournaments />
      <p className="py-10"></p>
    </div>
  );
}
