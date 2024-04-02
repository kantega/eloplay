import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import LoadingSpinner from "../loader/loading";
import { useRouter } from "next/router";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function TeamDeleteDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const teamId = useTeamId();
  const [value, setValue] = useState("");
  const router = useRouter();
  const deleteLeagueMutate = api.team.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "Team was deleted.",
        description: "You will be redirected to the home page in 3, 2, 1...",
        variant: "success",
      });

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
          <DialogTitle className="text-destructive">
            Deletion of team can NOT be undone
          </DialogTitle>
        </DialogHeader>
        <h1>This will be deleted with the team itself:</h1>
        <ol className="list-disc">
          <li className="ml-8"> All matches in the team </li>
          <li className="ml-8"> All player data in the team </li>
          <li className="ml-8"> All statistics in the team </li>
        </ol>
        <Input
          type="text"
          placeholder="Type delete to activate delete button..."
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <DialogFooter>
          <Button
            className="w-full"
            disabled={
              value.toLowerCase() !== "delete" || deleteLeagueMutate.isLoading
            }
            type="submit"
            variant="destructive"
            onClick={() => {
              deleteLeagueMutate.mutate({
                teamId,
              });
            }}
          >
            {deleteLeagueMutate.isLoading ? <LoadingSpinner /> : <TrashIcon />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
