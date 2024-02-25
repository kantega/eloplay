import { TeamContext } from "@/contexts/teamContext/team-provider";
import { useContext, useState } from "react";
import ChangeTeamName from "./change-team-name";
import { userIsAdmin } from "@/utils/role";
import { Button } from "../ui/button";
import { PencilLine, X } from "lucide-react";
import HeaderLabel from "../header-label";

export default function TeamName({ teamName }: { teamName: string }) {
  const { role } = useContext(TeamContext);
  const [changeTeamName, setChangeTeamName] = useState(false);

  return (
    <div className="flex items-end gap-2">
      {!changeTeamName && (
        <HeaderLabel headerText={teamName} label="TEAM NAME" />
      )}
      {changeTeamName && (
        <ChangeTeamName
          teamName={teamName}
          setChangeTeamName={setChangeTeamName}
        />
      )}
      {userIsAdmin(role) && (
        <Button
          className=" items-start p-4"
          variant={!changeTeamName ? "ghost" : "destructive"}
          size="sm"
          onClick={() => setChangeTeamName(!changeTeamName)}
        >
          {!changeTeamName ? <PencilLine size={16} /> : <X size={16} />}
        </Button>
      )}
    </div>
  );
}
