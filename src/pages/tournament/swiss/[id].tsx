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
import { useUserId } from "@/contexts/authContext/auth-provider";
import { toast } from "@/components/ui/use-toast";
import {
  type State,
  States,
  TournamentMenu,
} from "@/components/tournament-menu";
import SwissTournamentMatches from "@/components/tournaments/swiss-matches";
import SwissLeaderboard from "@/components/tournaments/swiss-leaderboard";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import SwissDeleteDialog from "@/components/tournaments/swiss-delete-dialog";
import { Trash2Icon } from "lucide-react";
import TournamentModerator from "@/components/auhtVisibility/tournament-moderator";

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
  const userId = useUserId();
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

  const yourTeamUser = filteredTeamUsers.find((user) => user.userId === userId);
  const yourSwissUser = swissUsers.find(
    (swissUser) => swissUser.userId === userId,
  );

  const ownerId = tournament.userId;
  if (tournament.status !== "PENDING")
    return (
      <>
        <SwissTournamentLayout
          tournament={tournament}
          teamUsers={filteredTeamUsers}
          swissUsers={swissUsers}
          matches={matches}
          yourSwissUser={yourSwissUser}
          yourTeamUser={yourTeamUser}
        />
        <DeleteTournamentButton tournament={tournament} />
      </>
    );

  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-8 py-4">
      <TournamentCard
        tournament={tournament}
        teamUser={yourTeamUser}
        swissUser={yourSwissUser}
      />
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
  yourSwissUser,
  yourTeamUser,
}: {
  tournament: SwissTournament;
  swissUsers: SwissTournamentUser[];
  teamUsers: TeamUser[];
  matches: SwissTournamentMatch[];
  yourSwissUser?: SwissTournamentUser;
  yourTeamUser?: TeamUser;
}) {
  const [state, setState] = useState<State>(States.INFORMATION);

  const renderState = () => {
    switch (state) {
      case States.INFORMATION:
        return (
          <>
            <TournamentCard
              tournament={tournament}
              teamUser={yourTeamUser}
              swissUser={yourSwissUser}
            />
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
            swissUsers={swissUsers}
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
    <div className="relative flex h-full w-full flex-col justify-center gap-8 py-4">
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
  const { userId: ownerId, id: tournamentId } = tournament;

  return (
    <TournamentModerator ownerId={ownerId}>
      <SwissDeleteDialog tournamentId={tournamentId}>
        <Button
          className="absolute bottom-0 right-0 w-fit hover:bg-background-tertiary"
          variant="destructive"
          size="sm"
        >
          <Trash2Icon />
        </Button>
      </SwissDeleteDialog>
    </TournamentModerator>
  );
}

function StartTournamentButton({
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
