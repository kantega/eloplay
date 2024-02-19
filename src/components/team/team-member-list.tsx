import { Badge } from "@/components/ui/badge";
import { RoleTexts } from "@/server/types/roleTypes";
import { filterMembers, type MemberProps } from "@/utils/match";
import { Input } from "@/components/ui/input";
import SetRoleUserButton from "@/components/team/set-role-user-button";
import { useState } from "react";

export default function TeamMemberList({
  members,
}: {
  members: MemberProps[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = filterMembers(members, searchQuery);

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
