import { api } from "@/utils/api";
import { filterMatches } from "@/utils/match";
import { type TableTennisMatch } from "@prisma/client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface Props {
  id: string;
  searchQuery: string;
}

export default function PlayerOpponentRadar({ id, searchQuery }: Props) {
  const { data: matchs, isLoading: matchsIsLoading } =
    api.match.findAllById.useQuery({ id });
  const { data, isLoading } = api.player.findById.useQuery({ id });
  if (!data || isLoading) return null;
  if (!matchs || matchsIsLoading) return null;

  const filteredMatches = filterMatches(matchs, searchQuery, id);
  const { radarData } = getRadarData(filteredMatches, id);

  if (radarData.length < 3) return null;

  return (
    <>
      <h1 className="m-0 text-2xl">Winrate radar vs opponents</h1>
      <RadarChart
        cx={160}
        cy={160}
        outerRadius={100}
        width={320}
        height={320}
        data={radarData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar
          name="Opponents WR radar"
          dataKey="WR"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </>
  );
}

interface RadarData {
  subject: string;
  WR: number;
  wins: number;
  total: number;
  fullMark: number;
}

const getRadarData = (matches: TableTennisMatch[], id: string) => {
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

  const doneRadarData = aggregatedList.map((item) => {
    return {
      ...item,
      WR: Math.floor((item.wins / item.total) * 100),
    };
  });

  const sortedRadarData = doneRadarData.sort((a, b) => b.total - a.total);

  return { radarData: sortedRadarData.slice(0, 6) };
};
