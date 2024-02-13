import { api } from "@/utils/api";
import Leaderboard from "../components/Leaderboard";
import { useContext } from "react";
import { LocationContext } from "@/contexts/locationContext/location-provider";

export default function Home() {
  const { location } = useContext(LocationContext);
  const players = api.player.findAll.useQuery({ office: location });

  return (
    <div className="container flex h-full flex-col items-center justify-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl font-bold">Leaderboard</h1>

      {players.data !== undefined && <Leaderboard data={players.data} />}
    </div>
  );
}
