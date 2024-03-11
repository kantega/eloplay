import { RoleTexts } from "@/server/types/roleTypes";
import { Button } from "@/components/ui/button";
import { userIsAdmin } from "@/utils/role";
import { useTeamRole } from "@/contexts/teamContext/team-provider";
import KickSVG from "@/assets/KickSVG";
import KickUserDialog from "./kick-user-dialog";
import { type TeamMemberProps } from "@/server/api/routers/leagueMatch/league-match-utils";

export default function KickUserButton({
  member,
}: {
  member: TeamMemberProps;
}) {
  const role = useTeamRole();

  if (member.role === RoleTexts.ADMIN || !userIsAdmin(role)) return null;

  return (
    <KickUserDialog userId={member.userId} gamerTag={member.gamerTag}>
      <Button className="h-8 w-8 items-start p-1" variant="ghost" size="sm">
        <KickSVG color1="fill-red-500" />
      </Button>
    </KickUserDialog>
  );
}
