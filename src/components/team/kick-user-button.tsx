import { RoleTexts } from "@/server/types/roleTypes";
import { Button } from "@/components/ui/button";
import KickSVG from "@/assets/KickSVG";
import KickUserDialog from "./kick-user-dialog";
import { type TeamMemberProps } from "@/server/api/routers/leagueMatch/league-match-utils";
import TeamAdmin from "../auhtVisibility/team-admin";

export default function KickUserButton({
  member,
}: {
  member: TeamMemberProps;
}) {
  if (member.role === RoleTexts.ADMIN) return null;

  return (
    <TeamAdmin>
      <KickUserDialog userId={member.userId} gamerTag={member.gamerTag}>
        <Button className="h-8 w-8 items-start p-1" variant="ghost" size="sm">
          <KickSVG color1="fill-red-500" />
        </Button>
      </KickUserDialog>
    </TeamAdmin>
  );
}
