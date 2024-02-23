import { HeartPulse, Medal, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 flex w-full justify-center bg-background-secondary">
      <div className="flex w-[min(500px,100%)] justify-around bg-background-secondary">
        <Link href={"/leaderboard"} className="p-4">
          <Medal className="text-primary" size={30} />
        </Link>
        <Link href={"/addLeagueMatch"} className="p-4">
          <PlusCircle className="text-primary" size={30} />
        </Link>
        <Link href={"/leagueActivity"} className="p-4">
          <HeartPulse className="text-primary" size={30} />
        </Link>
      </div>
    </div>
  );
}
