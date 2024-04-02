import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import LoadingSpinner from "../loader/loading";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import KickSVG from "@/assets/KickSVG";

export default function KickUserDialog({
  children,
  userId,
  gamerTag,
}: {
  children: React.ReactNode;
  userId: string;
  gamerTag: string;
}) {
  const teamId = useTeamId();
  const [value, setValue] = useState("");
  const ctx = api.useUtils();

  const kickUserMutate = api.team.kickUser.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "User has been kicked.",
        variant: "success",
      });
      void ctx.team.getAllBlockedUsers.invalidate({ teamId });
      void ctx.team.getAllMembers.invalidate({ teamId });
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
          <DialogTitle className="text-destructive">
            Kick user from team
          </DialogTitle>
        </DialogHeader>
        <h1>Kicking a user will have these consequences:</h1>
        <ol className="list-disc">
          <li className="ml-8">Delete user{"'"}s league users</li>
          <li className="ml-8">Delete user{"'"}s tournament results</li>
          <li className="ml-8">Add user to team{"'"}s block list </li>
        </ol>
        <Input
          type="text"
          placeholder="Type kick to activate kick button..."
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <DialogFooter>
          <Button
            className="w-full"
            disabled={
              value.toLowerCase() !== "kick" || kickUserMutate.isLoading
            }
            type="submit"
            variant="destructive"
            onClick={() => {
              kickUserMutate.mutate({
                gamerTag,
                userId,
                teamId,
              });
            }}
          >
            {kickUserMutate.isLoading ? (
              <LoadingSpinner />
            ) : (
              <KickSVG color1="fill-foreground" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
