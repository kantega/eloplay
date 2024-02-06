import { useRouter } from "next/router";
import MatchHistory from "./MatchHistory";
import { api } from "@/utils/api";

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container flex h-full flex-col items-center gap-40 px-4 py-4 ">
      {typeof id === "string" && <Player id={id} />}
      {typeof id === "string" && <MatchHistory id={id} />}
    </div>
  );
}

function Player({ id }: { id: string }) {
  const { data, isLoading } = api.player.findById.useQuery({ id });
  if (!data || isLoading) return null;

  return <h1 className="text-5xl font-bold">{data.name}</h1>;
}
