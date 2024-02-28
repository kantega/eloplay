import MinorHeaderLabel from "../minor-header-label";
import { type TeamUserTeamAndRole } from "../teamUser/team-user-types";
import { Badge } from "../ui/badge";

export default function ShowPickedMembers({
  members,
  contenders,
}: {
  members: TeamUserTeamAndRole[];
  contenders: string[];
}) {
  const filteredMembers = members.filter((teamUser) =>
    contenders.includes(teamUser.teamUser.id),
  );

  return (
    <>
      <MinorHeaderLabel headerText="Participants" />
      <div className="flex h-fit w-full flex-wrap items-start gap-1">
        {filteredMembers.map((member) => {
          return (
            <Badge key={member.teamUser.id} className="h-6" variant="secondary">
              {member.teamUser.gamerTag}
            </Badge>
          );
        })}
      </div>
    </>
  );
}
