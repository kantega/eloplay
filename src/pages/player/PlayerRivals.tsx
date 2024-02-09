import { api } from "@/utils/api";
import { filterMatches } from "@/utils/match";
import { type TableTennisMatch } from "@prisma/client";

interface Props {
  id: string;
  searchQuery: string;
}

export default function PlayerRivals({ id, searchQuery }: Props) {
  const { data: matchs, isLoading: matchsIsLoading } =
    api.match.findAllById.useQuery({ id });
  const { data, isLoading } = api.player.findById.useQuery({ id });
  if (!data || isLoading) return null;
  if (!matchs || matchsIsLoading) return null;

  const filteredMatches = filterMatches(matchs, searchQuery, id);
  const { nemesis, bestFriend } = getRivalsData(filteredMatches, id);

  return (
    <span className="flex w-full flex-row flex-wrap justify-between gap-2">
      <h1 className="text-3xl">🥳 {bestFriend?.subject.slice(0, 20)}</h1>
      <h1 className="text-3xl"> 👹 {nemesis?.subject}</h1>
    </span>
  );
}

interface RadarData {
  subject: string;
  WR: number;
  wins: number;
  total: number;
  fullMark: number;
}

const getRivalsData = (matches: TableTennisMatch[], id: string) => {
  const radarData: RadarData[] = matches.map((match) => {
    const isWin = match.winner === id;
    const opponent = !isWin ? match.player1Id : match.player2Id;
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

  const doneRivals = aggregatedList.map((item) => {
    return {
      ...item,
      WR: Math.floor(((item.wins + 1) / (item.total + 2)) * 100),
      wins: item.wins + 1,
      total: item.total + 2,
    };
  });

  const sortedRivals = doneRivals.sort((a, b) => b.WR - a.WR);

  const bestFriend = sortedRivals[0];

  const nemesis = sortedRivals[sortedRivals.length - 1];

  return { nemesis, bestFriend };
};
