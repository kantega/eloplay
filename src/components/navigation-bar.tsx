import { HeartPulse, Medal, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 flex w-full justify-center">
      <div className="bg-background-secondary flex w-[min(500px,100%)] justify-around">
        <Link href={"/new/leaderboard"} className="p-4">
          <Medal className="text-primary" size={30} />
        </Link>
        <Link href={"/new/addLeagueMatch"} className="p-4">
          <PlusCircle className="text-primary" size={30} />
        </Link>
        <Link href={"/new/leagueActivity"} className="p-4">
          <HeartPulse className="text-primary" size={30} />
        </Link>
      </div>
    </div>
  );
}
