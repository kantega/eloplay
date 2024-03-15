import { Button } from "@/components/ui/button";
import { type BlockedUser } from "@prisma/client";
import { api } from "@/utils/api";
import { X } from "lucide-react";
import TeamAdmin from "../auhtVisibility/team-admin";

export default function UnblockUserButton({ member }: { member: BlockedUser }) {
  const ctx = api.useUtils();

  const unblockUser = api.team.unblockUser.useMutation({
    onSuccess: () => {
      void ctx.team.getAllBlockedUsers.invalidate({ teamId: member.teamId });
    },
  });

  return (
    <TeamAdmin>
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
    </TeamAdmin>
  );
}
