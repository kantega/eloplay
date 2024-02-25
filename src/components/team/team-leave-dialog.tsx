import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { LogOutIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { toast } from "../ui/use-toast";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import LoadingSpinner from "../loading";
import { useRouter } from "next/router";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";

export default function TeamLeaveDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { teamId, setTeamId } = useContext(TeamContext);
  const { setLeagueId } = useContext(LeagueContext);
  const [value, setValue] = useState("");
  const router = useRouter();
  const ctx = api.useUtils();
  const deleteLeagueMutate = api.team.leaveTeam.useMutation({
    onSuccess: async () => {
      toast({
        title: "You have left the team.",
        description: "You will be redirected to the home page in 3, 2, 1...",
        variant: "success",
      });
      void ctx.team.getById.invalidate({ teamId });
      void ctx.team.getAll.invalidate();

      setLeagueId("");
      setTeamId("");
      localStorage.clear();

      setTimeout(() => {
        void router.push("/").then(() => router.reload());
      }, 3000);
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
          <DialogTitle className="text-destructive">Leave the team</DialogTitle>
        </DialogHeader>
        <h1>This will be deleted when leaving the team:</h1>
        <ol className="list-disc">
          <li className="ml-8"> All your matches in the team </li>
          <li className="ml-8"> All your data in the team </li>
        </ol>
        <Input
          type="text"
          placeholder="Type leave to activate leave button..."
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <DialogFooter>
          <Button
            className="w-full"
            disabled={
              value.toLowerCase() !== "leave" || deleteLeagueMutate.isLoading
            }
            type="submit"
            variant="destructive"
            onClick={() => {
              deleteLeagueMutate.mutate({
                teamId,
              });
            }}
          >
            {deleteLeagueMutate.isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Users size={16} />
                <LogOutIcon size={16} />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
