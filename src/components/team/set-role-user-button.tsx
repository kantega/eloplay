import { api } from "@/utils/api";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { userIsModerator } from "@/utils/role";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "../loading";

export default function SetRoleUserButton({
  member,
}: {
  member: { role: RoleText; id: string };
}) {
  const { role, teamId } = useContext(TeamContext);
  const ctx = api.useUtils();
  const { mutateAsync, isLoading } = api.team.updateRoleForMember.useMutation({
    onSuccess: async () => {
      void ctx.team.getById.invalidate({ teamId });

      toast({
        title: "Member role updated",
        description: "Nice, you updated the role for the member.",
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
      )}
    </>
  );
}
