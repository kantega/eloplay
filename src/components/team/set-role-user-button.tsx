import { api } from "@/utils/api";
import { RoleTexts } from "@/server/types/roleTypes";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "../loader/loading";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { type TeamMemberProps } from "@/server/api/routers/leagueMatch/league-match-utils";
import TeamAdmin from "../auhtVisibility/team-admin";

export default function SetRoleUserButton({
  member,
}: {
  member: TeamMemberProps;
}) {
  const teamId = useTeamId();
  const ctx = api.useUtils();
  const { mutateAsync, isLoading } = api.team.updateRoleForMember.useMutation({
    onSuccess: async () => {
      void ctx.team.getById.invalidate({ teamId });

      toast({
        title: "Member role updated",
        description: "Nice, you updated the role for the member.",
        variant: "success",
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      console.log(errorMessage);

      toast({
        title: "Error",
        description:
          errorMessage?.title ??
          errorMessage?.description ??
          "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  if (member.role === RoleTexts.ADMIN) return null;

  return (
    <TeamAdmin>
      <Button
        disabled={isLoading}
        className="h-8 w-8 items-start p-1"
        variant="ghost"
        size="sm"
        onClick={async () => {
          await mutateAsync({
            teamUserId: member.id,
            newRole:
              member.role === RoleTexts.MEMBER
                ? RoleTexts.MODERATOR
                : RoleTexts.MEMBER,
            teamId,
          });
        }}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading &&
          (member.role === RoleTexts.MEMBER ? (
            <ArrowBigUp className="text-primary" />
          ) : (
            <ArrowBigDown className="text-red-500" />
          ))}
      </Button>
    </TeamAdmin>
  );
}
