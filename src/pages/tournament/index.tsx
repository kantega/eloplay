import HeaderLabel from "@/components/header-label";
import ListOfTournaments from "@/components/tournaments/list-of-tournaments";
import PickTournamentToCreate from "@/components/tournaments/pick-tournament-to-create-dialog";
import { Button } from "@/components/ui/button";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { userIsModerator } from "@/utils/role";
import { PlusCircle } from "lucide-react";
import { useContext } from "react";

export default function TournamentPage() {
  const { role } = useContext(TeamContext);
  return (
    <div className="container relative flex h-full flex-col justify-center gap-8 px-4 py-4">
      <HeaderLabel label="TOURNAMENT" headerText="Pick Tournament" />
      {userIsModerator(role) && (
        <PickTournamentToCreate>
          <Button variant="ghost" size="sm" className="absolute right-2 top-2">
            <PlusCircle className="text-background-tertiary" />
          </Button>
        </PickTournamentToCreate>
      )}
      <ListOfTournaments />
      <p className="py-10"></p>
    </div>
  );
}
