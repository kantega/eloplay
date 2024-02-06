import { api } from "@/utils/api";
import Leaderboard from "../Leaderboard";

export default function Home() {
  const players = api.player.findAll.useQuery();

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      {players.data !== undefined && <Leaderboard data={players.data} />}
    </div>
  );
}
