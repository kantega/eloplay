import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PickTournamentToCreate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90dvw] rounded-sm sm:max-w-[425px]">
        <DialogHeader className="pb-8">
          <DialogTitle>Pick tournament to create</DialogTitle>
        </DialogHeader>
        <Link href="/tournament/swiss">
          <Button size="sm" variant="secondary">
            Create Swiss tournament
          </Button>
        </Link>
        {/* <Link href="/tournament/elimination">
          <Button size="sm" variant="secondary">
            Create Elimination tournament
          </Button>
        </Link>
        <Link href="/tournament/roundRobin">
          <Button size="sm" variant="secondary">
            Create Round Robin tournament
          </Button>
        </Link> */}
      </DialogContent>
    </Dialog>
  );
}
