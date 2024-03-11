import { Button } from "@/components/ui/button";
import { userIsAdmin } from "@/utils/role";
import { useTeamRole } from "@/contexts/teamContext/team-provider";
import { type BlockedUser } from "@prisma/client";
import { api } from "@/utils/api";
import { X } from "lucide-react";

export default function UnblockUserButton({ member }: { member: BlockedUser }) {
  const role = useTeamRole();
  const ctx = api.useUtils();

  const unblockUser = api.team.unblockUser.useMutation({
    onSuccess: () => {
      void ctx.team.getAllBlockedUsers.invalidate({ teamId: member.teamId });
    },
  });

  if (!userIsAdmin(role)) return null;

  return (
    <Button
      className="h-8 w-8 items-start p-1"
      variant="ghost"
      size="sm"
      onClick={() =>
        unblockUser.mutate({
          userId: member.userId,
          teamId: member.teamId,
        })
      }
    >
      <X size={16} />
    </Button>
  );
}
