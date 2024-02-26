import ChangeTeamUserName from "./change-team-user-name";
import { Button } from "../ui/button";
import { PencilLine, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import HeaderLabel from "../header-label";
import { type Team, type TeamUser } from "@prisma/client";
import { useState } from "react";
import { Separator } from "../ui/separator";

export default function TeamAndTeamUserProfile({
  role,
  teamUser,
  team,
}: {
  role: RoleText;
  teamUser: TeamUser;
  team: Team;
}) {
  return (
    <>
      <div className="relative">
        <Badge
          className="absolute right-0 top-0 h-fit"
          variant={role === RoleTexts.MEMBER ? "outline" : "default"}
        >
          {role}
        </Badge>
        <HeaderLabel headerText={team.name} label="Team" />
        <div className="flex items-end gap-4">
          <TeamUserName teamUser={teamUser} />
        </div>
      </div>
      <Separator className="bg-background-tertiary" />
    </>
  );
}

function TeamUserName({ teamUser }: { teamUser: TeamUser }) {
  const [changeTeamName, setChangeTeamName] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2">
      {!changeTeamName && (
        <HeaderLabel headerText={teamUser.gamerTag} label="GamerTag" />
      )}
      {changeTeamName && (
        <ChangeTeamUserName
          teamId={teamUser.teamId}
          teamUserName={teamUser.gamerTag}
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
