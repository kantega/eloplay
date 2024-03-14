import { useTeamRole } from "@/contexts/teamContext/team-provider";
import { userIsTournamentModerator } from "@/components/auhtVisibility/role";
import { useUserId } from "@/contexts/authContext/auth-provider";

export default function TournamentModerator({
  children,
  ownerId,
}: {
  children: React.ReactNode;
  ownerId: string;
}) {
  const userRole = useTeamRole();
  const userId = useUserId();

  if (!userIsTournamentModerator({ userRole, userId, ownerId })) return null;

  return <>{children}</>;
}
