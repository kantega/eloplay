import { api } from "@/utils/api";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { userIsModerator } from "@/utils/role";
import { toast } from "@/components/ui/use-toast";

export default function SetRoleUserButton({
  member,
}: {
  member: { role: RoleText; id: string };
}) {
  const { role, teamId } = useContext(TeamContext);
  const ctx = api.useUtils();
  const { mutateAsync } = api.team.setRoleForMember.useMutation({
    onSuccess: async () => {
      void ctx.team.findById.invalidate({ id: teamId });

      toast({
        title: "Member role updated",
        description: `Member is now ${role === RoleTexts.MEMBER ? RoleTexts.MODERATOR : RoleTexts.MEMBER}.`,
        variant: "default",
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

  return (
    <>
      {member.role !== RoleTexts.ADMIN && userIsModerator(role) && (
        <Button
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
          {member.role === RoleTexts.MEMBER ? (
            <ArrowBigUp className="text-primary" />
          ) : (
            <ArrowBigDown className="text-red-500" />
          )}
        </Button>
      )}
    </>
  );
}
