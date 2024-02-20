import LeagueMatchHistory from "@/components/leagueMatch/league-match-history";

export default function LeagueActivityPage() {
  return (
    <div className="container flex h-full flex-col items-center justify-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl font-bold">Recent league activity</h1>
      <LeagueMatchHistory />
    </div>
  );
}
