import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import HeaderLabel from "../header-label";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export function LeagueHeader({ label }: { label: string }) {
  return (
    <Suspense fallback={<Skeleton className="h-12 w-full" />}>
      <InnerLeagueHeader label={label} />
    </Suspense>
  );
}

function InnerLeagueHeader({ label }: { label: string }) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const [data] = api.league.get.useSuspenseQuery({ leagueId, teamId });

  return <HeaderLabel headerText={data?.name ?? ""} label={label} />;
}
