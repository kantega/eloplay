import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { getRadarData } from "./league-user-utils";
import { type LeagueMatchWithProfiles } from "./league-user-types";

interface Props {
  userId: string;
  leagueMatchesWithProfiles: LeagueMatchWithProfiles[];
}

export default function LeagueUserRadarGraph({
  userId,
  leagueMatchesWithProfiles,
}: Props) {
  const { radarData } = getRadarData(leagueMatchesWithProfiles, userId);

  if (radarData.length < 3) return null;

  return (
    <span className="flex flex-col items-center justify-center">
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
    </span>
  );
}
