import { filterBlockedUsers } from "@/server/api/routers/leagueMatch/league-match-utils";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { type BlockedUser } from "@prisma/client";
import UnblockUserButton from "./unblock-user-button";
import MinorHeaderLabel from "../minor-header-label";
import SearchBar from "../search-bar";

export default function BlockList({
  blockedUsers,
}: {
  blockedUsers?: BlockedUser[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredBlockedUsers = filterBlockedUsers(searchQuery, blockedUsers);

  const sortedBlockedUsers = filteredBlockedUsers.sort((a, b) =>
    a.gamerTag.localeCompare(b.gamerTag),
  );

  return (
    <div className="relative w-full space-y-4">
      <MinorHeaderLabel headerText="Block list" />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={"Search for blocked users..."}
      />

      <ul className="flex flex-col justify-center gap-1">
        {sortedBlockedUsers.map((teamUser) => {
          return (
            <li className="mt-2 w-full" key={teamUser.id}>
              <div className=" flex items-center justify-between gap-4">
                <div className="flex w-[80%] justify-between">
                  {teamUser.gamerTag}
                </div>
                <div className="flex gap-4">
                  <UnblockUserButton member={teamUser} />
                </div>
              </div>
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
