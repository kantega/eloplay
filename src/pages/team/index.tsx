import LoadingSpinner from "@/components/loader/loading";
import { api } from "@/utils/api";
import TeamMemberList from "@/components/team/team-member-list";
import TeamLeagueList from "@/components/league/team-league-list";
import TeamName from "@/components/team/team-name";
import CreateLeagueForm from "@/components/league/create-league-form";
import { Button } from "@/components/ui/button";
import {
  ArrowBigRightDash,
  LogOutIcon,
  Trash2,
  User,
  Users,
} from "lucide-react";
import TeamTransferOwnershipDialog from "@/components/team/team-transfer-ownership-dialog";
import TeamDeleteDialog from "@/components/team/team-delete-dialog";
import TeamLeaveDialog from "@/components/team/team-leave-dialog";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import BlockList from "@/components/team/block-list";
import TeamAdmin from "@/components/auhtVisibility/team-admin";
import TeamNotAdmin from "@/components/auhtVisibility/team-not-admin";
import TeamModerator from "@/components/auhtVisibility/team-moderator";
import { TeamMenu, TeamStates, type TeamState } from "@/components/team-menu";
import { useState } from "react";

export default function TeamPage() {
  return (
    <div className="container flex h-full w-full flex-col items-center gap-8 p-4">
      <TeamInfo />
    </div>
  );
}

function TeamInfo() {
  const [state, setState] = useState<TeamState>(TeamStates.LEAGUES);
  const teamId = useTeamId();
  const { data, isLoading } = api.team.getById.useQuery({
    teamId,
  });

  const { data: blockedUsers } = api.team.getAllBlockedUsers.useQuery({
    teamId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Team not found</div>;

  const getStateComponent = (state: TeamState) => {
    switch (state) {
      case TeamStates.LEAGUES:
        return (
          <>
            <TeamModerator>
              <CreateLeagueForm />
              <TeamLeagueList />
            </TeamModerator>
          </>
        );
      case TeamStates.MEMBERS:
        return <TeamMemberList teamUsers={data.teamUsers} />;
      case TeamStates.BLOCKLIST:
        return <BlockList blockedUsers={blockedUsers} />;
    }
  };

  return (
    <>
      <TeamMenu
        currentState={state}
        states={[TeamStates.LEAGUES, TeamStates.MEMBERS, TeamStates.BLOCKLIST]}
        setState={setState}
      />
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-end justify-between">
          <TeamName teamName={data.team.name} />
          <span className="flex gap-4">
            {data.teamUsers.length > 1 && (
              <TeamAdmin>
                <TeamTransferOwnershipDialog teamUsers={data.teamUsers}>
                  <Button
                    className="hover:bg-background-tertiary"
                    variant="ghost"
                    size="sm"
                  >
                    <User size={16} />
                    <ArrowBigRightDash size={16} />
                    <Users size={16} />
                  </Button>
                </TeamTransferOwnershipDialog>
              </TeamAdmin>
            )}

            <TeamNotAdmin>
              <TeamLeaveDialog>
                <Button
                  className="gap-2 hover:bg-destructive"
                  variant="ghost"
                  size="sm"
                >
                  <Users size={16} />
                  <LogOutIcon size={16} />
                </Button>
              </TeamLeaveDialog>
            </TeamNotAdmin>
            {data.teamUsers.length === 1 && (
              <TeamAdmin>
                <TeamDeleteDialog>
                  <Button
                    className="hover:bg-destructive"
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TeamDeleteDialog>
              </TeamAdmin>
            )}
          </span>
        </div>
        {getStateComponent(state)}
        <span className="py-10" />
      </div>
    </>
  );
}
