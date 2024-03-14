import { useTeamRole } from "@/contexts/teamContext/team-provider";
import { userIsMember } from "@/components/auhtVisibility/role";

export default function TeamMember({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useTeamRole();

  if (!userIsMember(role)) return null;

  return <>{children}</>;
}
