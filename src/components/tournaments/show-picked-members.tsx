import { PlusCircle } from "lucide-react";
import MessageBox from "../message-box";
import MinorHeaderLabel from "../minor-header-label";
import { type TeamUserTeamAndRole } from "../teamUser/team-user-types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import PickMembers from "./pick-members";

export default function ShowPickedMembers({
  members,
  contenders,
  setSelected,
}: {
  members: TeamUserTeamAndRole[];
  contenders: string[];
  setSelected: (selected: string) => void;
}) {
  const filteredMembers = members.filter((teamUser) =>
    contenders.includes(teamUser.teamUser.id),
  );

  return (
    <div>
      <div className="flex items-center">
        <MinorHeaderLabel headerText="Participants" />
        <PickMembers
          members={members}
          selected={contenders}
          setSelected={setSelected}
        >
          <Button variant="ghost">
            <PlusCircle className="text-primary" size={20} />
          </Button>
        </PickMembers>
      </div>
      <div className="flex h-fit min-h-10 w-full flex-wrap items-start gap-1 rounded-sm border-2 border-solid border-background-secondary p-2">
        {filteredMembers.length === 0 && (
          <MessageBox>
            There are currently no participents in this tournament
          </MessageBox>
        )}
        {filteredMembers.map((member) => {
          return (
            <Badge
              key={member.teamUser.id}
              className="mr-0 flex h-6 gap-2 pr-0"
              variant="secondary"
            >
              {member.teamUser.gamerTag}
              <span className="flex h-full items-center justify-center">
                <Separator
                  orientation="vertical"
                  className=" bg-background-tertiary"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-fit w-fit items-center justify-center text-center"
                  onClick={() => {
                    setSelected(member.teamUser.id);
                  }}
                >
                  x
                </Button>
              </span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
