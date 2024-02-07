import { useRouter } from "next/router";
import MatchHistory from "./MatchHistory";
import { api } from "@/utils/api";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMatchStats, sortMatchesByDate } from "@/utils/match";

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      {typeof id === "string" && <Player id={id} />}
      {typeof id === "string" && <MatchHistory id={id} />}
    </div>
  );
}

function Player({ id }: { id: string }) {
  const { data: matchs, isLoading: matchsIsLoading } =
    api.match.findAllById.useQuery({ id });
  const { data, isLoading } = api.player.findById.useQuery({ id });
  if (!data || isLoading) return null;
  if (!matchs || matchsIsLoading) return null;

  matchs.sort(sortMatchesByDate);
  const { winrate, winstreak } = getMatchStats(matchs, id);

  return (
    <Card className="relative w-[min(350px,90%)]">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <b>{data.name}</b>
          <Badge variant="secondary" className="absolute right-4 top-4">
            {data.office}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-row gap-8">
          <p>
            <b>Winrate: </b> {" " + winrate}%
          </p>
          <p>
            <b>Streak:</b> {winstreak}
          </p>
        </div>
        <Badge className="absolute bottom-4 left-4 text-2xl">
          Elo: {data.elo}
        </Badge>
        <p className="absolute bottom-4 right-4 text-xs">
          Joined:{" "}
          {data.createdAt.getDate() +
            1 +
            "-" +
            (data.createdAt.getMonth() + 1) +
            "-" +
            data.createdAt.getFullYear()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
