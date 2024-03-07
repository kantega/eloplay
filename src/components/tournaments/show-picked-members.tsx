import { PlusCircle } from "lucide-react";
import MessageBox from "../message-box";
import MinorHeaderLabel from "../minor-header-label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import PickMembers from "./pick-members";
import { type TeamUser } from "@prisma/client";

export default function ShowPickedMembers({
  members,
  contenders,
  setSelected,
  showPickMembersDialog = true,
  isOpen = true,
}: {
  members: TeamUser[];
  contenders: string[];
  setSelected?: (selected: string) => void;
  showPickMembersDialog?: boolean;
  isOpen?: boolean;
}) {
  const filteredMembers = members.filter((teamUser) =>
    contenders.includes(teamUser.userId),
  );

  return (
    <div>
      <div className="flex items-center">
        <MinorHeaderLabel headerText="Participants" />
        {!!setSelected && showPickMembersDialog && (
          <PickMembers
            members={members}
            selected={contenders}
            setSelected={setSelected}
          >
            <Button variant="ghost">
              <PlusCircle className="text-primary" size={20} />
            </Button>
          </PickMembers>
        )}
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
              key={member.id}
              className={
                !!setSelected && isOpen
                  ? "mr-0 flex h-6 gap-2 pr-0"
                  : "flex h-6 gap-2"
              }
              variant="secondary"
            >
              {member.gamerTag}
              {!!setSelected && isOpen && (
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
                      setSelected(member.userId);
                    }}
                  >
                    x
                  </Button>
                </span>
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
