"use client";

import LeagueMatchCard from "@/components/leagueMatch/league-match-card";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";
import { filterMatches } from "./league-match-util";
import LeagueUserRivals from "../leagueUser/league-user-rivals";
import LeagueUserRadarGraph from "../leagueUser/league-user-radar-graph";
import DeleteLeagueMatchDialog from "./delete-league-match-dialog";

export default function LeagueUserMatchHistory({
  leagueUserId,
  searchQuery,
}: {
  leagueUserId: string;
  searchQuery: string;
}) {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const { data: leagueUserData, isLoading: leagueUserIsLoading } =
    api.leagueUser.findById.useQuery({
      leagueUserId,
      id: teamId,
    });
  const { data, isLoading } = api.leagueMatch.getAllById.useQuery({
    leagueUserId,
    leagueId,
    id: teamId,
  });

  if (isLoading || !data) return null;
  if (leagueUserIsLoading || !leagueUserData) return null;

  const filteredMatches = filterMatches({
    matches: data.leagueMatchesWithProfiles,
    searchQuery,
    winnerId: leagueUserData.leagueUser.userId,
  });

  const sortedLeagueMatchesWithProfiles = filteredMatches.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      <LeagueUserRivals
        userId={leagueUserData.leagueUser.userId}
        leagueMatchesWithProfiles={sortedLeagueMatchesWithProfiles}
      />
      <LeagueUserRadarGraph
        userId={leagueUserData.leagueUser.userId}
        leagueMatchesWithProfiles={sortedLeagueMatchesWithProfiles}
      />
      <ul className="w-full">
        {sortedLeagueMatchesWithProfiles.map((leagueMatchWithProfiles) => {
          return (
            <li key={leagueMatchWithProfiles.match.id}>
              <DeleteLeagueMatchDialog
                leagueMatch={leagueMatchWithProfiles.match}
              >
                <LeagueMatchCard {...leagueMatchWithProfiles} />
              </DeleteLeagueMatchDialog>
            </li>
          );
        })}
      </ul>
    </>
  );
}