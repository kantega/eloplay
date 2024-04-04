import LeagueUserCard from "@/components/leagueUser/league-user-card";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";

export default function SpecificLeagueUser({
  leagueUserId,
}: {
  leagueUserId?: string;
}) {
  const skeleton = <Skeleton className="h-96 w-full" />;

  if (!leagueUserId)
    return (
      <Suspense fallback={skeleton}>
        <YourLeagueUserCardContent />
      </Suspense>
    );
  return (
    <Suspense fallback={skeleton}>
      <SpecificLeagueUserContent leagueUserId={leagueUserId} />
    </Suspense>
  );
}

function SpecificLeagueUserContent({ leagueUserId }: { leagueUserId: string }) {
  const teamId = useTeamId();
  const [data] = api.leagueUser.getById.useSuspenseQuery({
    leagueUserId,
    teamId,
  });

  const { leagueUser, teamUser, league } = data;

  return (
    <LeagueUserCard
      leagueUser={leagueUser}
      teamUser={teamUser}
      leagueName={league.name}
    />
  );
}

function YourLeagueUserCardContent() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const [data] = api.leagueUser.get.useSuspenseQuery({
    leagueId,
    teamId,
  });

  const { leagueUser, teamUser, league } = data;

  return (
    <LeagueUserCard
      leagueUser={leagueUser}
      teamUser={teamUser}
      leagueName={league.name}
    />
  );
}
