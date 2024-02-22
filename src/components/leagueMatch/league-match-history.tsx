"use client";

import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";
import LeagueMatchCard from "./league-match-card";
import DeleteLeagueMatchDialog from "./delete-league-match-dialog";
// import { getNiceDateString } from "./league-match-util";
// todo: add date separators to the match history list

export default function LeagueMatchHistory() {
  const { leagueId } = useContext(LeagueContext);
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.leagueMatch.getAll.useQuery({
    leagueId,
    id: teamId,
  });

  if (isLoading || !data) return null;

  const sortedLeagueMatchesWithProfiles = data.leagueMatchesWithProfiles.sort(
    (a, b) => b.match.createdAt.getTime() - a.match.createdAt.getTime(),
  );

  return (
    <>
      <ul>
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
      <span className="py-10" />
    </>
  );
}
