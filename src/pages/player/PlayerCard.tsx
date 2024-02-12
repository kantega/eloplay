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
import { filterMatches, getMatchStats } from "@/utils/match";
import { Meteors } from "@/components/meteors";

export default function PlayerCard({
  id,
  searchQuery,
}: {
  id: string;
  searchQuery: string;
}) {
  const { data: matchs, isLoading: matchsIsLoading } =
    api.match.findAllById.useQuery({ id });
  const { data, isLoading } = api.player.findById.useQuery({ id });
  if (!data || isLoading) return null;
  if (!matchs || matchsIsLoading) return null;

  const filteredMatches = filterMatches(matchs, searchQuery, id);
  const { winrate, winstreak } = getMatchStats(filteredMatches, id);

  return (
    <Card className=" relative w-full overflow-hidden">
      <Meteors number={10} />
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
            <b>Total:</b> {filteredMatches.length}
          </p>
          <p>
            <b>Streak:</b>
            {winstreak}
          </p>
          <p>
            <b>WR: </b> {winrate}%
          </p>
        </div>
        <Badge className="absolute bottom-4 left-4 text-2xl">
          Elo: {data.elo}
        </Badge>
        <p className="absolute bottom-4 right-4 text-xs">
          Joined:{" "}
          {data.createdAt.getDate() +
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
