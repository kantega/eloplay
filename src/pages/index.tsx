import { api } from "@/utils/api";
import Leaderboard from "./Leaderboard";

export default function Home() {
  const players = api.player.findAll.useQuery();

  return (
    <div className="container flex h-full flex-col items-center justify-center gap-40 px-4 py-4 ">
      <h1 className="text-5xl font-bold">Leaderboard</h1>
      {players.data !== undefined && <Leaderboard data={players.data} />}
    </div>
  );
}
