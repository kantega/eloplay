import { HeartPulse, Medal, NotepadText, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex w-full justify-center bg-background-secondary">
      <div className="flex w-[min(700px,100%)] justify-around bg-background-secondary">
        <Link href={"/leaderboard"} className="p-4">
          <Medal className="text-primary" size={30} />
        </Link>
        <Link href={"/addLeagueMatch"} className="p-4">
          <PlusCircle className="text-primary" size={30} />
        </Link>
        <Link href={"/leagueActivity"} className="p-4">
          <HeartPulse className="text-primary" size={30} />
        </Link>
        <Link href={"/tournament"} className="p-4">
          <NotepadText className="text-primary" size={30} />
        </Link>
      </div>
    </div>
  );
}
