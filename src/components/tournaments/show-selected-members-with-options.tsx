import ShowPickedMembers from "@/components/tournaments/show-picked-members";
import { toast } from "@/components/ui/use-toast";
import { useUserId } from "@/contexts/authContext/auth-provider";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { useTeamId, useTeamRole } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { userIsTournamentModerator } from "@/components/auhtVisibility/role";
import { type SwissTournament, type TeamUser } from "@prisma/client";
import { useMemo, useState } from "react";
import JoinTournamentButton from "./join-tournament-button";
import LeaveTournamentButton from "./leave-tournament-button";

export default function ShowPickedMembersWithOptions({
  ownerId,
  teamUsers,
  tournament,
}: {
  ownerId: string;
  teamUsers: TeamUser[];
  tournament: SwissTournament;
}) {
  const [contenders, setContenders] = useState<string[]>([]);
  const teamId = useTeamId();
  const role = useTeamRole();
  const leagueId = useLeagueId();
  const ctx = api.useUtils();
  const userId = useUserId();

  const tournamentId = tournament.id;

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

  if (userIsTournamentModerator({ userId, userRole: role, ownerId }))
    return (
      <div className="relative">
        {tournament.isOpen && (
          <LeaveOrJoinButton {...{ contenders, userId, tournamentId }} />
        )}
        <ShowPickedMembers
          members={teamUsers}
          contenders={contenders}
          showPickMembersDialog={false}
          isOpen={tournament.isOpen}
        />
      </div>
    );

  // todo: add a button to add players for tournament moderators --> showPickMembersDialog={true}
  return (
    <div className="relative">
      {tournament.isOpen && (
        <LeaveOrJoinButton {...{ contenders, userId, tournamentId }} />
      )}
      <ShowPickedMembers
        members={teamUsers}
        contenders={contenders}
        setSelected={setSelected}
        showPickMembersDialog={false}
        isOpen={tournament.isOpen}
      />
    </div>
  );
}

function LeaveOrJoinButton({
  contenders,
  userId,
  tournamentId,
}: {
  contenders: string[];
  userId: string;
  tournamentId: string;
}) {
  return (
    <>
      {contenders.includes(userId) ? (
        <LeaveTournamentButton tournamentId={tournamentId} />
      ) : (
        <JoinTournamentButton tournamentId={tournamentId} />
      )}
    </>
  );
}
