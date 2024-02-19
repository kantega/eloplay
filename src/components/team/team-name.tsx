import { TeamContext } from "@/contexts/teamContext/team-provider";
import { useContext, useState } from "react";
import ChangeTeamName from "./change-team-name";
import { userIsAdmin } from "@/utils/role";
import { Button } from "../ui/button";
import { PencilLine, X } from "lucide-react";

export default function TeamName({ teamName }: { teamName: string }) {
  const { role } = useContext(TeamContext);
  const [changeTeamName, setChangeTeamName] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2">
      {!changeTeamName && <h1 className=" text-5xl">{teamName}</h1>}
      {changeTeamName && (
        <ChangeTeamName
          teamName={teamName}
          setChangeTeamName={setChangeTeamName}
        />
      )}
      {userIsAdmin(role) && (
        <Button
          variant={!changeTeamName ? "ghost" : "destructive"}
          size="icon"
          onClick={() => setChangeTeamName(!changeTeamName)}
        >
          {!changeTeamName ? <PencilLine /> : <X />}
        </Button>
      )}
    </div>
  );
}
