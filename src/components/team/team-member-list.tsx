import { Badge } from "@/components/ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import { type TeamMemberProps, filterTeamUsers } from "@/utils/match";
import { Input } from "@/components/ui/input";
import SetRoleUserButton from "@/components/team/set-role-user-button";
import { useState } from "react";
import Link from "next/link";

export default function TeamMemberList({
  teamUsers,
}: {
  teamUsers: TeamMemberProps[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeamUsers = filterTeamUsers(teamUsers, searchQuery);

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
        {filteredTeamUsers.map((teamUser) => {
          return (
            <li key={teamUser.id} className=" flex gap-4">
              <Link href={`/new/profile/${teamUser.id}`}>
                {teamUser.gamerTag}
              </Link>
              <Badge
                variant={
                  teamUser.role === RoleTexts.MEMBER ? "outline" : "default"
                }
              >
                {teamUser.role}
              </Badge>
              <SetRoleUserButton member={teamUser} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
