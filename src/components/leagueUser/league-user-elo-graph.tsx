import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { getLatestEloList } from "@/server/api/routers/leagueMatch/league-match-utils";
import { Tooltip, YAxis, AreaChart, Area, ResponsiveContainer } from "recharts";
import LoadingSpinner from "../loading";

interface Props {
  leagueUserId: string;
}

export default function LeagueUserEloGraph({ leagueUserId }: Props) {
  const teamId = useTeamId();
  const { data, isLoading } = api.leagueUser.getById.useQuery({
    teamId,
    leagueUserId: leagueUserId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const { graphData, min, max } = makeGraphData(
    getLatestEloList(data.leagueUser.latestEloGain),
    data.leagueUser.elo,
  );
  return (
    <ResponsiveContainer width="100%" aspect={2 / 1}>
      <AreaChart width={380} height={200} data={graphData}>
        <defs>
          <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[min, max]} hide />
        <Tooltip
          labelFormatter={() => ""}
          cursor={false}
          contentStyle={{
            backgroundColor: "#212121",
            color: "#04C89A",
            borderColor: "#04C89A",
            border: "2px solid",
            borderRadius: "8px",
            margin: "0",
            padding: "4px 8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="ELO"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#total)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const makeGraphData = (matches: number[], startElo: number) => {
  let currentElo = startElo;

  const newMatches = matches.map((match) => {
    currentElo -= match;
    return currentElo;
  });

  newMatches.unshift(startElo);
  return getGraphData(newMatches);
};

const getGraphData = (matches: number[]) => {
  let min = matches.reduce((a, b) => Math.min(a, b));
  let max = matches.reduce((a, b) => Math.max(a, b));

  const graphData = matches.reverse().map((match, index) => {
    return {
      createdAt: index,
      ELO: match,
    };
  });

  min = Math.floor(min / 100) * 100 - 50;
  max = Math.ceil(max / 100) * 100;

  return { graphData, min, max };
};
