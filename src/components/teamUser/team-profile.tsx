import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext, useState } from "react";
import ChangeTeamUserName from "./change-team-user-name";
import { Button } from "../ui/button";
import { PencilLine, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";

export default function TeamProfile() {
  const { role } = useContext(TeamContext);

  return (
    <div className="flex gap-4">
      <TeamUserName />
      <Badge variant={role === RoleTexts.MEMBER ? "outline" : "default"}>
        {role}
      </Badge>
    </div>
  );
}

function TeamUserName() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.teamUser.get.useQuery({ id: teamId });
  const [changeTeamName, setChangeTeamName] = useState(false);

  if (isLoading || !data) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {!changeTeamName && <h1 className=" text-md">{data.gamerTag}</h1>}
      {changeTeamName && (
        <ChangeTeamUserName
          teamUserId={data.id}
          teamUserName={data.gamerTag}
          setChangeTeamUserName={setChangeTeamName}
        />
      )}
      <Button
        className="h-6 w-6"
        variant={!changeTeamName ? "ghost" : "destructive"}
        size="icon"
        onClick={() => setChangeTeamName(!changeTeamName)}
      >
        {!changeTeamName ? <PencilLine size={16} /> : <X size={16} />}
      </Button>
    </div>
  );
}
