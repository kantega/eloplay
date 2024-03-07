import { type MatchStatus } from "@prisma/client";
import { Badge } from "../ui/badge";

export default function TournamentStatusBadge({
  isOpen,
  status,
}: {
  isOpen: boolean;
  status: MatchStatus;
}) {
  if (isOpen)
    return (
      <Badge className="absolute right-2 top-2">Open for registration</Badge>
    );

  if (status == "IN_PROGRESS")
    return (
      <Badge className="absolute right-2 top-2" variant="outline">
        In progress
      </Badge>
    );

  return <Badge className="absolute right-2 top-2">{status}</Badge>;
}
