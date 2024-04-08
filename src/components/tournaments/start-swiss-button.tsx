import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import { type SwissTournament } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import TournamentModerator from "@/components/auhtVisibility/tournament-moderator";

export function StartTournamentButton({
  tournament,
}: {
  tournament: SwissTournament;
}) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const ctx = api.useUtils();

  const startTournament = api.swissTournament.start.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Tournament started!",
        variant: "success",
      });
      void ctx.swissTournament.get.invalidate({
        teamId: tournament.teamId,
        leagueId: tournament.leagueId,
        tournamentId: tournament.id,
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

  const { userId: ownerId, id: tournamentId } = tournament;

  return (
    <TournamentModerator ownerId={ownerId}>
      {tournament.status === "PENDING" && (
        <Button
          disabled={startTournament.isLoading}
          className="hover:bg-background-tertiary"
          variant="outline"
          size="sm"
          onClick={() =>
            startTournament.mutate({
              teamId,
              leagueId,
              tournamentId,
            })
          }
        >
          Start tournament
        </Button>
      )}
    </TournamentModerator>
  );
}
