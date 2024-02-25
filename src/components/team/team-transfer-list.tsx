import { Badge } from "@/components/ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import {
  type TeamMemberProps,
  filterTeamUsers,
} from "@/server/api/routers/leagueMatch/league-match-utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../loading";
import { Button } from "../ui/button";

export default function TeamTransferList({
  teamUsers,
  newAdminUserId,
  setNewAdminUserId,
}: {
  teamUsers: TeamMemberProps[];
  newAdminUserId: string;
  setNewAdminUserId: (newAdminUserId: string) => void;
}) {
  const { data: sessionData, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  if (status === "loading") return <LoadingSpinner />;
  if (!sessionData) return null;

  const filteredTeamUsers = filterTeamUsers(teamUsers, searchQuery);

  const sortedTeamUsers = filteredTeamUsers.sort((a, b) =>
    a.gamerTag.localeCompare(b.gamerTag),
  );

  const removeCurrentUser = sortedTeamUsers.filter(
    (teamUser) => teamUser.userId !== sessionData.user.id,
  );

  if (removeCurrentUser.length === 0) {
    return (
      <h1 className="rounded-sm bg-background-tertiary p-2">
        No other members found
      </h1>
    );
  }

  return (
    <div className="relative w-full space-y-4">
      <Input
        className="sticky top-14 z-10"
        placeholder="search for member..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
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
