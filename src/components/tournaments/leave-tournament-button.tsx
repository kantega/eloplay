import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { UserMinus } from "lucide-react";

export default function LeaveTournamentButton({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const ctx = api.useUtils();

  const mutateAsync = api.swissTournament.leave.useMutation({
    onSuccess: async () => {
      void ctx.swissTournament.get.invalidate({
        teamId,
        leagueId,
        tournamentId,
      });
      toast({
        title: "Successfully left the tournament!",
        description: "We will miss you! But you can always join again.",
        variant: "default",
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;

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
    <Button
      size="icon"
      variant="destructive"
      className="absolute right-0 top-0 m-0 h-6 w-6 p-1"
      onClick={() => {
        mutateAsync.mutate({ teamId, leagueId, tournamentId });
      }}
    >
      <UserMinus size={16} />
    </Button>
  );
}
