import { type RoleText } from "@/server/types/roleTypes";
import { type Team, type TeamUser } from "@prisma/client";

export interface TeamUserTeamAndRole {
  role: RoleText;
  teamUser: TeamUser;
  team: Team;
}
