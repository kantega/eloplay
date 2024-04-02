import ActivitySVG from "@/assets/ActivitySVG";
import AddMatchSVG from "@/assets/AddMatchSVG";
import LeaderboardSVG from "@/assets/LeaderboardSVG";
import TournamentSVG from "@/assets/TournamentSVG";
import Link from "next/link";
import { Label } from "./ui/label";
import { AccountDropdown } from "./account-dropdown";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex w-full justify-center bg-background-secondary">
      <div className="flex w-[min(700px,100%)] justify-around bg-background-secondary">
        <NavButton href="/leaderboard" label="Leaderboard">
          <LeaderboardSVG size={30} relativeSize={false} />
        </NavButton>
        <NavButton href="/leagueActivity" label="Activity">
          <ActivitySVG size={30} relativeSize={false} />
        </NavButton>
        <NavButton href="/addLeagueMatch" label="Add match">
          <AddMatchSVG size={30} relativeSize={false} />
        </NavButton>
        <NavButton href="/tournament" label="Tournament">
          <TournamentSVG size={30} relativeSize={false} />
        </NavButton>
        <AccountDropdown />
      </div>
    </div>
  );
}

function NavButton({
  href,
  label,
  children,
}: {
  href: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-full p-2"
    >
      {children}
      {label && <Label className=" text-center text-[10px]">{label}</Label>}
    </Link>
  );
}
