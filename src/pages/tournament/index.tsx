import HeaderLabel from "@/components/header-label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RoundRobinTournamentPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <HeaderLabel label="TOURNAMENT" headerText="Pick Tournament" />
      <Link href="/tournament/swiss">
        <Button>Go to swiss tournament</Button>
      </Link>
      <Link href="/tournament/elimination">
        <Button>Go to Bracket tournament</Button>
      </Link>
      <Link href="/tournament/roundRobin">
        <Button>Go to Round Robin tournament</Button>
      </Link>
    </div>
  );
}
