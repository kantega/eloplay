import { Badge } from "@/components/ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import { type TeamMemberProps, filterTeamUsers } from "@/utils/match";
import { Input } from "@/components/ui/input";
import SetRoleUserButton from "@/components/team/set-role-user-button";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "../ui/separator";

export default function TeamMemberList({
  teamUsers,
}: {
  teamUsers: TeamMemberProps[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeamUsers = filterTeamUsers(teamUsers, searchQuery);

  const sortedTeamUsers = filteredTeamUsers.sort((a, b) =>
    a.gamerTag.localeCompare(b.gamerTag),
  );

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
        {sortedTeamUsers.map((teamUser) => {
          return (
            <>
              <li
                key={teamUser.id}
                className=" flex items-center justify-between gap-4"
              >
                <div className="flex w-[80%] justify-between">
                  <Link href={`/new/teamUser/${teamUser.id}`}>
                    {teamUser.gamerTag}
                  </Link>
                  <Badge
                    className="h-fit"
                    variant={
                      teamUser.role === RoleTexts.MEMBER ? "outline" : "default"
                    }
                  >
                    {teamUser.role}
                  </Badge>
                </div>
                <SetRoleUserButton member={teamUser} />
              </li>
              <div className="relative m-2 w-full">
                <Separator className=" absolute left-[-3%] top-1/2 w-[100%] bg-background-tertiary" />
              </div>
            </>
          );
        })}
      </ul>
    </>
  );
}
