import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext, useState } from "react";
import ChangeTeamUserName from "./change-team-user-name";
import { Button } from "../ui/button";
import { PencilLine, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import HeaderLabel from "../header-label";

export default function TeamProfile() {
  const { role } = useContext(TeamContext);

  return (
    <div className="flex items-end gap-4">
      <TeamUserName />
      <Badge
        className="h-fit"
        variant={role === RoleTexts.MEMBER ? "outline" : "default"}
      >
        {role}
      </Badge>
    </div>
  );
}

function TeamUserName() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.teamUser.get.useQuery({ teamId });
  const [changeTeamName, setChangeTeamName] = useState(false);

  if (isLoading || !data) return null;

  return (
    <div className="flex items-end justify-center gap-2">
      {!changeTeamName && (
        <HeaderLabel headerText={data.gamerTag} label="Team User Profile" />
      )}
      {changeTeamName && (
        <ChangeTeamUserName
          teamUserName={data.gamerTag}
          setChangeTeamUserName={setChangeTeamName}
        />
      )}
      <Button
        className="h-6 w-6 items-start p-1"
        variant={!changeTeamName ? "ghost" : "destructive"}
        size="sm"
        onClick={() => setChangeTeamName(!changeTeamName)}
      >
        {!changeTeamName ? <PencilLine size={16} /> : <X size={16} />}
      </Button>
    </div>
  );
}
