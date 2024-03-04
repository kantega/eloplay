import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { UserPlus } from "lucide-react";
import { useContext } from "react";

export default function JoinTournamentButton({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const ctx = api.useUtils();

  const mutateAsync = api.swissTournament.join.useMutation({
    onSuccess: async () => {
      void ctx.swissTournament.get.invalidate({
        teamId,
        leagueId,
        tournamentId,
      });
      toast({
        title: "Success",
        description: "Welcome, your are part of the tournament!",
        variant: "success",
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
      className="absolute right-8 top-0 m-0 h-6 w-6 p-1"
      onClick={() => {
        mutateAsync.mutate({ teamId, leagueId, tournamentId });
      }}
    >
      <UserPlus size={16} />
    </Button>
  );
}
