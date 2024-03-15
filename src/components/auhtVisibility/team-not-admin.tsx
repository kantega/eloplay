import { useTeamRole } from "@/contexts/teamContext/team-provider";
import { userIsAdmin } from "@/components/auhtVisibility/role";

export default function TeamNotAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useTeamRole();

  if (!!userIsAdmin(role)) return null;

  return <>{children}</>;
}
