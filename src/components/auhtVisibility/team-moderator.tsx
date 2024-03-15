import { useTeamRole } from "@/contexts/teamContext/team-provider";
import { userIsModerator } from "@/components/auhtVisibility/role";

export default function TeamModerator({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useTeamRole();

  if (!userIsModerator(role)) return null;

  return <>{children}</>;
}
