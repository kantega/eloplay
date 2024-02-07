import { api } from "@/utils/api";
import { filterMatches, getTime } from "@/utils/match";
import { type TableTennisMatch } from "@prisma/client";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  YAxis,
} from "recharts";

interface Props {
  id: string;
  searchQuery: string;
}

export default function PlayerEloGraph({ id, searchQuery }: Props) {
  const { data: matchs, isLoading: matchsIsLoading } =
    api.match.findAllById.useQuery({ id });
  const { data, isLoading } = api.player.findById.useQuery({ id });
  if (!data || isLoading) return null;
  if (!matchs || matchsIsLoading) return null;

  const filteredMatches = filterMatches(matchs, searchQuery);
  const { graphData, min, max } = getGraphData(filteredMatches, id, data.elo);

  return (
    <LineChart
      width={350}
      height={200}
      data={graphData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="createdAt" visibility={""} />
      <YAxis domain={[min, max]} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="ELO"
        stroke="#6D27D9"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}

const getGraphData = (matches: TableTennisMatch[], id: string, elo: number) => {
  let min = 999999999;
  let max = -1;

  if (elo < min) min = elo;
  if (elo > max) max = elo;

  const graphData = matches.reverse().map((match) => {
    const ELO = match.winner === id ? match.prePlayer1Elo : match.prePlayer2Elo;
    if (ELO < min) min = ELO;
    if (ELO > max) max = ELO;

    return {
      createdAt: getTime(match.createdAt),
      ELO,
    };
  });

  min -= 10;
  max += 10;

  min = Math.floor(min / 100) * 100;
  max = Math.ceil(max / 100) * 100;

  graphData.push({ createdAt: getTime(new Date()), ELO: elo });

  return { graphData, min, max };
};
