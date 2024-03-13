import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { ArrowBigRightDash, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import LoadingSpinner from "../loading";
import { type TeamMemberProps } from "@/server/api/routers/leagueMatch/league-match-utils";
import TeamTransferList from "./team-transfer-list";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function TeamTransferOwnershipDialog({
  teamUsers,
  children,
}: {
  teamUsers: TeamMemberProps[];
  children: React.ReactNode;
}) {
  const [newAdminUserId, setNewAdminUserId] = useState("123");
  const teamId = useTeamId();
  const [transferInputValue, setTransferInputValue] = useState("");
  const ctx = api.useUtils();
  const transferTeamMutate = api.team.transferTeamOwnerShip.useMutation({
    onSuccess: async () => {
      void ctx.team.getRoleByUserId.invalidate();
      void ctx.team.getById.invalidate({ teamId });

      toast({
        title: "Success",
        description: "Team has been transfered.",
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
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Transfer ownership of team
          </DialogTitle>
        </DialogHeader>
        <h1>
          You are about to transfer the ownership of the team. This can not be
          undone. Your successor is a lucky person or AI.
        </h1>
        <TeamTransferList
          teamUsers={teamUsers}
          newAdminUserId={newAdminUserId}
          setNewAdminUserId={setNewAdminUserId}
        />
        {newAdminUserId !== "" && (
          <Input
            type="text"
            placeholder="Type transfer to activate transfer button..."
            value={transferInputValue}
            onChange={(e) => setTransferInputValue(e.currentTarget.value)}
          />
        )}
        <DialogFooter>
          {newAdminUserId !== "" && (
            <Button
              className="w-full"
              disabled={
                transferInputValue.toLowerCase() !== "transfer" ||
                transferTeamMutate.isLoading
              }
              type="submit"
              variant="default"
              onClick={() => {
                transferTeamMutate.mutate({
                  newAdminUserId,
                  teamId,
                });
              }}
            >
              {transferTeamMutate.isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <User size={16} />
                  <ArrowBigRightDash size={16} />
                  <Users size={16} />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
