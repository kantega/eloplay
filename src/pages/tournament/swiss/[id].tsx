import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import ShowPickedMembers from "@/components/tournaments/show-picked-members";
import TournamentCard from "@/components/tournaments/tournament-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUserId } from "@/contexts/authContext/auth-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { userIsModerator } from "@/utils/role";
import { type TeamUser } from "@prisma/client";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";

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
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);

  const { data: tournamentAndUsers, isLoading } =
    api.swissTournament.get.useQuery({
      teamId,
      leagueId,
      tournamentId: id,
    });

  if (isLoading) return <LoadingSpinner />;
  if (!tournamentAndUsers)
    return <MessageBox>We could not find the tournament :( </MessageBox>;

  const teamUsers = tournamentAndUsers.teamUsers.filter(
    (user): user is TeamUser => user !== null,
  );

  return (
    <div className="container relative flex h-full flex-col justify-center gap-8 px-4 py-4">
      <TournamentCard tournament={tournamentAndUsers.tournament} />
      <ShowPickedMembersWithOptions
        teamUsers={teamUsers}
        tournamentId={tournamentAndUsers.tournament.id}
        ownerId={tournamentAndUsers.tournament.userId}
      />
      <JoinTournamentButton tournamentId={id} />
      <LeaveTournamentButton tournamentId={id} />
      <p className="p-10"></p>
    </div>
  );
}

function JoinTournamentButton({ tournamentId }: { tournamentId: string }) {
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
      onClick={() => {
        mutateAsync.mutate({ teamId, leagueId, tournamentId });
      }}
    >
      Join Tournament
    </Button>
  );
}

function LeaveTournamentButton({ tournamentId }: { tournamentId: string }) {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
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
      variant="destructive"
      onClick={() => {
        mutateAsync.mutate({ teamId, leagueId, tournamentId });
      }}
    >
      Leave Tournament
    </Button>
  );
}

function ShowPickedMembersWithOptions({
  ownerId,
  teamUsers,
  tournamentId,
}: {
  ownerId: string;
  teamUsers: TeamUser[];
  tournamentId: string;
}) {
  const [contenders, setContenders] = useState<string[]>([]);
  const { teamId, role } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const ctx = api.useUtils();
  const userId = useUserId();

  useMemo(() => {
    const contendersFiltered = teamUsers.map((user) => user.userId);
    setContenders(contendersFiltered);
  }, [teamUsers]);

  const addPlayerMutate = api.swissTournament.addPlayer.useMutation({
    onSuccess: async () => {
      void ctx.swissTournament.get.invalidate({
        teamId,
        leagueId,
        tournamentId: ownerId,
      });
      toast({
        title: "Success",
        description: "Player added to tournament!",
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

  const removeMutate = api.swissTournament.removePlayer.useMutation({
    onSuccess: async () => {
      void ctx.swissTournament.get.invalidate({
        teamId,
        leagueId,
        tournamentId,
      });
      toast({
        title: "Success",
        description: "Player removed from tournament!",
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

  // addplayer and removeplayer, check if player in contenders to decide function call
  const setSelected = (newUserId: string) => {
    console.log("newUserId", newUserId);
    if (contenders.includes(newUserId))
      removeMutate.mutate({
        teamId,
        leagueId,
        tournamentId,
        userId: newUserId,
      });
    else
      addPlayerMutate.mutate({
        teamId,
        leagueId,
        tournamentId,
        userId: newUserId,
      });
  };

  if (!userIsModerator(role) || userId !== ownerId)
    return (
      <ShowPickedMembers
        members={teamUsers}
        contenders={contenders}
        showPickMembersDialog={false}
      />
    );

  return (
    <ShowPickedMembers
      members={teamUsers}
      contenders={contenders}
      setSelected={setSelected}
      showPickMembersDialog={false}
    />
  );
}
