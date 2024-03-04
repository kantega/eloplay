import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import TournamentCard from "@/components/tournaments/tournament-card";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import {
  type SwissTournament,
  type SwissTournamentMatch,
  type TeamUser,
} from "@prisma/client";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
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
  const { teamId, role } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const userId = useUserId();

  const { data, isLoading } = api.swissTournament.get.useQuery({
    teamId,
    leagueId,
    tournamentId: id,
  });

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

  if (isLoading) return <LoadingSpinner />;
  if (!data)
    return <MessageBox>We could not find the tournament :( </MessageBox>;

  const { matches, teamUsers, tournament } = data;

  const filteredTeamUsers = teamUsers.filter(
    (user): user is TeamUser => user !== null,
  );

  const ownerId = tournament.userId;
  if (!tournament.isOpen)
    return (
      <SwissTournamentLayout
        tournament={tournament}
        teamUsers={filteredTeamUsers}
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
      {userIsTournamentModerator({ userRole: role, ownerId, userId }) &&
        tournament.isOpen && (
          <Button
            disabled={
              !(
                filteredTeamUsers.length > 1 &&
                filteredTeamUsers.length % 2 === 0
              ) || startTournament.isLoading
            }
            className="hover:bg-background-tertiary"
            variant="outline"
            size="sm"
            onClick={() =>
              startTournament.mutate({
                teamId,
                leagueId,
                tournamentId: id,
              })
            }
          >
            Start tournament
          </Button>
        )}

      <p className="p-10"></p>
    </div>
  );
}

function SwissTournamentLayout({
  tournament,
  teamUsers,
  matches,
}: {
  tournament: SwissTournament;
  teamUsers: TeamUser[];
  matches: SwissTournamentMatch[];
}) {
  const [state, setState] = useState<State>(States.INFORMATION);
  const { teamId, role } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const userId = useUserId();
  const ownerId = tournament.userId;

  const renderState = () => {
    switch (state) {
      case States.INFORMATION:
        return (
          <>
            <TournamentCard tournament={tournament} />
            <ShowPickedMembersWithOptions
              teamUsers={teamUsers}
              tournament={tournament}
              ownerId={ownerId}
            />
          </>
        );
      case States.MATCHES:
        return <SwissTournamentMatches matches={matches} />;
    }
  };

  return (
    <div className="container relative flex h-full flex-col justify-center gap-8 px-4 py-4">
      <TournamentMenu
        currentState={state}
        setState={setState}
        states={[States.INFORMATION, States.MATCHES]}
      />
      {renderState()}
      <p className="p-10"></p>
    </div>
  );
}

function SwissTournamentMatches({
  matches,
}: {
  matches: SwissTournamentMatch[];
}) {
  const { role } = useContext(TeamContext);
  const userId = useUserId();

  console.log(role, userId);

  return (
    <div>
      {matches.map((match) => {
        return (
          <div key={match.id}>
            {match.status} {match.id} {match.teamId} {match.leagueId}
          </div>
        );
      })}
    </div>
  );
}
