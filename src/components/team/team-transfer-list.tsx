import { Badge } from "@/components/ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import {
  type TeamMemberProps,
  filterTeamUsers,
} from "@/server/api/routers/leagueMatch/league-match-utils";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useUserId } from "@/contexts/authContext/auth-provider";
import SearchBar from "../search-bar";

export default function TeamTransferList({
  teamUsers,
  newAdminUserId,
  setNewAdminUserId,
}: {
  teamUsers: TeamMemberProps[];
  newAdminUserId: string;
  setNewAdminUserId: (newAdminUserId: string) => void;
}) {
  const userId = useUserId();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeamUsers = filterTeamUsers(teamUsers, searchQuery);

  const sortedTeamUsers = filteredTeamUsers.sort((a, b) =>
    a.gamerTag.localeCompare(b.gamerTag),
  );

  const removeCurrentUser = sortedTeamUsers.filter(
    (teamUser) => teamUser.userId !== userId,
  );

  return (
    <div className="relative w-full space-y-4">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={"Search for members..."}
      />

      <ul className="flex flex-col justify-center gap-1">
        {removeCurrentUser.map((teamUser) => {
          return (
            <li className="mt-2 w-full" key={teamUser.id}>
              <Button
                className={
                  " flex w-full justify-between gap-4 py-0 " +
                  (teamUser.userId === newAdminUserId
                    ? "bg-background-tertiary hover:bg-background-tertiary"
                    : "hover:bg-background-secondary")
                }
                variant="ghost"
                onClick={() => setNewAdminUserId(teamUser.userId)}
              >
                {teamUser.gamerTag}
                <Badge
                  className="h-fit"
                  variant={
                    teamUser.role === RoleTexts.MEMBER ? "outline" : "default"
                  }
                >
                  {teamUser.role}
                </Badge>
              </Button>
              <div className="relative m-2 w-full">
                <Separator className=" absolute left-[-3%] top-1/2 w-[100%] bg-background-tertiary" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
