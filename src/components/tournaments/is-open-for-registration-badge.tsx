import { Badge } from "../ui/badge";

export default function IsOpenForRegistrationBadge({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return (
    <>
      {isOpen ? (
        <Badge className="absolute right-2 top-2">Open for registration</Badge>
      ) : (
        <Badge className="absolute right-2 top-2" variant="destructive">
          Closed for registration
        </Badge>
      )}
    </>
  );
}
