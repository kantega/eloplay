import { LeagueHeader } from "@/components/league/league-header";
import AddLeagueMatchForm from "@/components/leagueMatch/add-league-match-form";

export default function AddMatchPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-4 px-4 py-4">
      <LeagueHeader label={"ADD LEAGUE MATCH"} />
      <AddLeagueMatchForm />
    </div>
  );
}
