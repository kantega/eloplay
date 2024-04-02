import LeagueMatchHistory from "@/components/leagueMatch/league-match-history";
import LoadingSpinner from "@/components/loader/loading";
import { Suspense } from "react";
import { SuspenseLeagueHeader } from "@/components/league/suspense-league-header";

export default function LeagueActivityPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <Suspense fallback={<LoadingSpinner />}>
        <SuspenseLeagueHeader label={"ACTIVITY"} />
      </Suspense>
      <LeagueMatchHistory />
    </div>
  );
}
