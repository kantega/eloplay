import LeagueUserSkeleton from "./league-user-skeleton";

export default function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <LeagueUserSkeleton />
      <LeagueUserSkeleton className="delay-150" />
      <LeagueUserSkeleton className="delay-300" />
      <LeagueUserSkeleton />
      <LeagueUserSkeleton className="delay-150" />
      <LeagueUserSkeleton className="delay-300" />
      <LeagueUserSkeleton />
      <LeagueUserSkeleton className="delay-150" />
      <LeagueUserSkeleton className="delay-300" />
    </div>
  );
}
