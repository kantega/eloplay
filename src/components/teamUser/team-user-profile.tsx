import { useTeamId, useTeamRole } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useState } from "react";
import ChangeTeamUserName from "./change-team-user-name";
import { Button } from "../ui/button";
import { PencilLine, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import HeaderLabel from "../header-label";
import LoadingSpinner from "../loader/loading";

export default function TeamUserProfile() {
  const role = useTeamRole();

  return (
    <div className=" relative flex items-end gap-4 pt-2">
      <TeamUserName />
      <Badge
        className="absolute right-0 top-0 h-fit"
        variant={role === RoleTexts.MEMBER ? "outline" : "default"}
      >
        {role}
      </Badge>
    </div>
  );
}

function TeamUserName() {
  const teamId = useTeamId();
  const { data, isLoading } = api.teamUser.get.useQuery({ teamId });
  const [changeTeamName, setChangeTeamName] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {!changeTeamName && (
        <HeaderLabel headerText={data.gamerTag} label="TEAM USER PROFILE" />
      )}
      {changeTeamName && (
        <ChangeTeamUserName
          teamId={teamId}
          teamUserName={data.gamerTag}
          setChangeTeamUserName={setChangeTeamName}
        />
      )}
      <Button
        className="h-6 w-6 items-end p-1"
        variant={!changeTeamName ? "ghost" : "destructive"}
        size="sm"
        onClick={() => setChangeTeamName(!changeTeamName)}
      >
        {!changeTeamName ? <PencilLine size={16} /> : <X size={16} />}
      </Button>
    </div>
  );
}
