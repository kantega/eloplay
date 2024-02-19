import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import { useContext, useState } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { Button } from "@/components/ui/button";
import { PencilLine, X } from "lucide-react";
import { userIsAdmin } from "@/utils/role";
import { type MemberProps, filterMembers } from "@/utils/match";
import { Input } from "@/components/ui/input";
import ChangeTeamName from "../../../components/team/change-team-name";
import SetRoleUserButton from "../../../components/team/set-role-user-button";

export default function PlayerPage() {
  const { role, teamId } = useContext(TeamContext);

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl">You are a {role}</h1>
      <TeamInfo id={teamId} />
    </div>
  );
}

function TeamInfo({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = api.team.findById.useQuery({
    id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Team not found</div>;

  const filteredMembers = filterMembers(data.members, searchQuery);

  return (
    <div className="flex flex-col gap-4">
      <TeamName teamName={data.team.name} />
      <MemberList
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredMembers={filteredMembers}
      />
    </div>
  );
}

function TeamName({ teamName }: { teamName: string }) {
  const { role } = useContext(TeamContext);
  const [changeTeamName, setChangeTeamName] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2">
      {!changeTeamName && <h1 className=" text-5xl">{teamName}</h1>}
      {changeTeamName && (
        <ChangeTeamName
          teamName={teamName}
          setChangeTeamName={setChangeTeamName}
        />
      )}
      {userIsAdmin(role) && (
        <Button
          variant={!changeTeamName ? "ghost" : "destructive"}
          size="icon"
          onClick={() => setChangeTeamName(!changeTeamName)}
        >
          {!changeTeamName ? <PencilLine /> : <X />}
        </Button>
      )}
    </div>
  );
}

function MemberList({
  searchQuery,
  setSearchQuery,
  filteredMembers,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredMembers: MemberProps[];
}) {
  return (
    <>
      <Input
        placeholder="search for member..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
      />
      <ul className="flex flex-col justify-center gap-1">
        {filteredMembers.map((member) => {
          return (
            <li key={member.id} className=" flex gap-4">
              {member.name}{" "}
              <Badge
                variant={
                  member.role === RoleTexts.MEMBER ? "outline" : "default"
                }
              >
                {member.role}
              </Badge>
              <SetRoleUserButton member={member} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
