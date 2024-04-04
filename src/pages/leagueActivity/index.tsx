import LeagueMatchHistory from "@/components/leagueMatch/league-match-history";
import { LeagueHeader } from "@/components/league/league-header";

export default function LeagueActivityPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <LeagueHeader label={"ACTIVITY"} />
      <LeagueMatchHistory />
    </div>
  );
}
