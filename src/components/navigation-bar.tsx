import ActivitySVG from "@/assets/ActivitySVG";
import AddMatchSVG from "@/assets/AddMatchSVG";
import LeaderboardSVG from "@/assets/LeaderboardSVG";
import TournamentSVG from "@/assets/TournamentSVG";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex w-full justify-center bg-background-secondary">
      <div className="flex w-[min(700px,100%)] justify-around bg-background-secondary">
        <Link href={"/leaderboard"} className="p-4">
          <LeaderboardSVG
            className="text-primary"
            size={30}
            relativeSize={false}
          />
        </Link>
        <Link href={"/addLeagueMatch"} className="p-4">
          <AddMatchSVG
            className="text-primary"
            size={30}
            relativeSize={false}
          />
        </Link>
        <Link href={"/leagueActivity"} className="p-4">
          <ActivitySVG size={30} relativeSize={false} />
        </Link>
        <Link href={"/tournament"} className="p-4">
          <TournamentSVG size={30} relativeSize={false} />
        </Link>
      </div>
    </div>
  );
}
