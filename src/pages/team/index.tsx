import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import TeamMemberList from "@/components/team/team-member-list";
import TeamLeagueList from "@/components/league/team-league-list";
import TeamName from "@/components/team/team-name";
import CreateLeagueForm from "@/components/league/create-league-form";
import { userIsAdmin, userIsModerator } from "@/utils/role";
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

export default function PlayerPage() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <TeamInfo />
    </div>
  );
}

function TeamInfo() {
  const { teamId, role } = useContext(TeamContext);
  const { data, isLoading } = api.team.getById.useQuery({
    teamId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Team not found</div>;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-end justify-between">
        <TeamName teamName={data.team.name} />
        <span className="flex gap-4">
          {userIsAdmin(role) && data.teamUsers.length > 1 && (
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
          )}
          {!userIsAdmin(role) && (
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
          )}
          {userIsAdmin(role) && data.teamUsers.length === 1 && (
            <TeamDeleteDialog>
              <Button
                className="hover:bg-destructive"
                variant="ghost"
                size="sm"
              >
                <Trash2 size={16} />
              </Button>
            </TeamDeleteDialog>
          )}
        </span>
      </div>
      {userIsModerator(role) && (
        <>
          <CreateLeagueForm />
          <TeamLeagueList />
        </>
      )}

      <TeamMemberList teamUsers={data.teamUsers} />
    </div>
  );
}
