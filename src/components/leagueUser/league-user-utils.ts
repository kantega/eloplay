import {
  type LeagueUserAndTeamUser,
  type LeagueMatchWithProfiles,
} from "./league-user-types";

export interface RadarData {
  subject: string;
  WR: number;
  wins: number;
  total: number;
  fullMark: number;
}

export const getRivalsData = (
  leagueMatchesWithProfiles: LeagueMatchWithProfiles[],
  userId: string,
) => {
  const aggregatedList = getAggregatedList(leagueMatchesWithProfiles, userId);

  const doneRivals = aggregatedList.map((item) => {
    return {
      ...item,
      WR: Math.floor(((item.wins + 1) / (item.total + 2)) * 100),
      wins: item.wins + 1,
      total: item.total + 2,
    };
  });

  const sortedRivals = doneRivals.sort((a, b) => b.WR - a.WR);
  return {
    nemesis: sortedRivals[sortedRivals.length - 1],
    bestFriend: sortedRivals[0],
  };
};

export const getRadarData = (
  leagueMatchesWithProfiles: LeagueMatchWithProfiles[],
  userId: string,
) => {
  const aggregatedList = getAggregatedList(leagueMatchesWithProfiles, userId);

  const doneRadarData = aggregatedList.map((item) => {
    return {
      ...item,
      WR: Math.floor((item.wins / item.total) * 100),
    };
  });

  const sortedRadarData = doneRadarData.sort((a, b) => b.total - a.total);
  return { radarData: sortedRadarData.slice(0, 6) };
};

const getAggregatedList = (
  matches: LeagueMatchWithProfiles[],
  userId: string,
) => {
  const radarData: RadarData[] = matches.map((match) => {
    const isWin = match.match.winnerId === userId;
    const opponent = !isWin
      ? match.winnerTeamUser.gamerTag
      : match.loserTeamUser.gamerTag;
    return {
      subject: opponent,
      WR: 0,
      wins: isWin ? 1 : 0,
      total: 1,
      fullMark: 100,
    };
  });

  const aggregatedList: RadarData[] = radarData.reduce((acc, curr) => {
    const existingItem = acc.find((item) => item.subject === curr.subject);
    if (existingItem) {
      existingItem.wins += curr.wins;
      existingItem.total += curr.total;
    } else {
      acc.push({
        subject: curr.subject,
        wins: curr.wins,
        total: curr.total,
        WR: 0,
        fullMark: 100,
      });
    }
    return acc;
  }, [] as RadarData[]);

  return aggregatedList;
};

export const sortAndFilterForInactivePlayers = (
  leagueUsers: LeagueUserAndTeamUser[],
  showInactivePlayers: boolean,
  userId: string,
) => {
  leagueUsers.sort(sortPlayers);
  return leagueUsers.filter((player) =>
    showInactivePlayers
      ? true
      : player.leagueUser.matchCount > 0 || player.leagueUser.userId === userId,
  );
};

const sortPlayers = (
  playerA: LeagueUserAndTeamUser,
  playerB: LeagueUserAndTeamUser,
) => playerB.leagueUser.elo - playerA.leagueUser.elo;
