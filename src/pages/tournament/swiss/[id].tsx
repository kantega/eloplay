import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import TournamentCard from "@/components/tournaments/tournament-card";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import {
  type SwissTournamentUser,
  type SwissTournament,
  type SwissTournamentMatch,
  type TeamUser,
} from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import ShowPickedMembersWithOptions from "../../../components/tournaments/show-selected-members-with-options";
import { Button } from "@/components/ui/button";
import { userIsTournamentModerator } from "@/utils/role";
import { useUserId } from "@/contexts/authContext/auth-provider";
import { toast } from "@/components/ui/use-toast";
import {
  type State,
  States,
  TournamentMenu,
} from "@/components/tournament-menu";
import SwissTournamentMatches from "@/components/tournaments/swiss-matches";
import SwissLeaderboard from "@/components/tournaments/swiss-leaderboard";
import { useTeamId, useTeamRole } from "@/contexts/teamContext/team-provider";

export default function SwissTournamentIdPage() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <SwissTournamentPage id={id} />
      <span className="py-6" />
    </div>
  );
}

function SwissTournamentPage({ id }: { id: string }) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const { data, isLoading } = api.swissTournament.get.useQuery({
    teamId,
    leagueId,
    tournamentId: id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data)
    return <MessageBox>We could not find the tournament :( </MessageBox>;

  const { matches, teamUsers, tournament, swissUsers } = data;

  const filteredTeamUsers = teamUsers.filter(
    (user): user is TeamUser => user !== null,
  );

  const ownerId = tournament.userId;
  if (!tournament.isOpen)
    return (
      <SwissTournamentLayout
        tournament={tournament}
        teamUsers={filteredTeamUsers}
        swissUsers={swissUsers}
        matches={matches}
      />
    );

  return (
    <div className="container relative flex h-full flex-col justify-center gap-8 px-4 py-4">
      <TournamentCard tournament={tournament} />
      <ShowPickedMembersWithOptions
        teamUsers={filteredTeamUsers}
        tournament={tournament}
        ownerId={ownerId}
      />
      <StartTournamentButton tournament={tournament} />
      <DeleteTournamentButton tournament={tournament} />

      <p className="p-10"></p>
    </div>
  );
}

function SwissTournamentLayout({
  tournament,
  swissUsers,
  teamUsers,
  matches,
}: {
  tournament: SwissTournament;
  swissUsers: SwissTournamentUser[];
  teamUsers: TeamUser[];
  matches: SwissTournamentMatch[];
}) {
  const [state, setState] = useState<State>(States.INFORMATION);

  const renderState = () => {
    switch (state) {
      case States.INFORMATION:
        return (
          <>
            <TournamentCard tournament={tournament} />
            <ShowPickedMembersWithOptions
              teamUsers={teamUsers}
              tournament={tournament}
              ownerId={tournament.userId}
            />
            <DeleteTournamentButton tournament={tournament} />
          </>
        );
      case States.MATCHES:
        return (
          <SwissTournamentMatches
            matches={matches}
            teamUsers={teamUsers}
            tournament={tournament}
          />
        );
      case States.LEADERBOARD:
        return (
          <SwissLeaderboard swissUsers={swissUsers} teamUsers={teamUsers} />
        );
    }
  };

  return (
    <div className="container relative flex h-full flex-col justify-center gap-8 px-4 py-4">
      <TournamentMenu
        currentState={state}
        setState={setState}
        states={[States.INFORMATION, States.MATCHES, States.LEADERBOARD]}
      />
      {renderState()}
      <p className="p-10"></p>
    </div>
  );
}

function DeleteTournamentButton({
  tournament,
}: {
  tournament: SwissTournament;
}) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const role = useTeamRole();
  const userId = useUserId();
  const router = useRouter();

  const deleteTournament = api.swissTournament.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Tournament deleted!",
        variant: "success",
      });
      void router.push("/tournament");
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
    <>
      {userIsTournamentModerator({ userRole: role, ownerId, userId }) && (
        <Button
          disabled={deleteTournament.isLoading}
          className="hover:bg-background-tertiary"
          variant="destructive"
          size="sm"
          onClick={() =>
            deleteTournament.mutate({
              teamId,
              leagueId,
              tournamentId,
            })
          }
        >
          Delete tournament
        </Button>
      )}
    </>
  );
}

function StartTournamentButton({
  tournament,
}: {
  tournament: SwissTournament;
}) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const userId = useUserId();
  const role = useTeamRole();

  const startTournament = api.swissTournament.start.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Tournament started!",
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

  const { userId: ownerId, id: tournamentId } = tournament;

  return (
    <>
      {userIsTournamentModerator({ userRole: role, ownerId, userId }) &&
        tournament.isOpen && (
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
    </>
  );
}
