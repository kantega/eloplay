import LeagueUserMatchHistory from "@/components/leagueMatch/league-user-match-history";
import LeagueUserCard from "@/components/leagueUser/league-user-card";
import LoadingSpinner from "@/components/loading";
import { Input } from "@/components/ui/input";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useState } from "react";

export default function LeagueUserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const { data, isLoading } = api.leagueUser.get.useQuery({
    leagueId,
    teamId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const { leagueUser, teamUser, league } = data;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <LeagueUserCard
        leagueUser={leagueUser}
        teamUser={teamUser}
        leagueName={league.name}
      />

      <div className="relative w-full">
        <Input
          className="sticky top-16 z-10"
          placeholder="search for opponent..."
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value.currentTarget.value);
          }}
        />
        <LeagueUserMatchHistory
          leagueUserId={leagueUser.id}
          searchQuery={searchQuery}
        />
      </div>
      <span className="py-6" />
    </div>
  );
}
