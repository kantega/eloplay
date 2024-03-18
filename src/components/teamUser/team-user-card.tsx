import React from "react";
import { type LeagueUserAndTeamUser } from "../leagueUser/league-user-types";
import MinityrLeagueMatchHistory from "../leagueMatch/minityr-league-match-history";
import { getLatestEloList } from "@/server/api/routers/leagueMatch/league-match-utils";
import TeamUserImage from "./team-user-image";
import { truncate } from "./team-user-utils";

export default function TeamUserCard({
  player,
  currentEloIndex,
}: {
  player: LeagueUserAndTeamUser;
  currentEloIndex?: number;
}) {
  const eloGainList = getLatestEloList(player.leagueUser.latestEloGain);

  return (
    <div className="flex items-center gap-2">
      <TeamUserImage image={player.teamUser.image} index={currentEloIndex} />
      <div className="group flex flex-col items-start">
        {/*? EASTER EGG: Losing streak of 10 matches gives the nickname freelo on hover */}
        {player.leagueUser.streak <= -10 && (
          <>
            <p className="text-xl group-hover:hidden">
              {truncate(player.teamUser.gamerTag, 20)}
            </p>
            <p className="hidden text-xl group-hover:block">FREELO</p>
          </>
        )}
        {player.leagueUser.streak > -10 && (
          <p className="text-md">{truncate(player.teamUser.gamerTag, 20)}</p>
        )}
        <div className="flex items-center space-x-2">
          {<MinityrLeagueMatchHistory eloList={eloGainList} />}
          <p className="text-sm text-gray-500">
            {player.leagueUser.matchCount - player.leagueUser.matchLossCount}-
            {player.leagueUser.matchLossCount}
          </p>
        </div>
      </div>
    </div>
  );
}
