import AddLeagueMatchForm from "@/components/leagueMatch/add-league-match-form";
import LoadingSpinner from "@/components/loader/loading";
import { Suspense } from "react";
import { SuspenseLeagueHeader } from "@/components/league/suspense-league-header";

export default function AddMatchPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-4 px-4 py-4">
      <Suspense fallback={<LoadingSpinner />}>
        <SuspenseLeagueHeader label={"ADD LEAGUE MATCH"} />
      </Suspense>
      <AddLeagueMatchForm />
    </div>
  );
}
