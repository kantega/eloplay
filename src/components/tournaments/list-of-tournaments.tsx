import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import { type SwissTournament } from "@prisma/client";
import Link from "next/link";
import LoadingSpinner from "../loading";
import MessageBox from "../message-box";
import TournamentCard from "./tournament-card";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function ListOfTournaments() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const { data, isLoading } = api.swissTournament.getAll.useQuery({
    teamId,
    leagueId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data)
    return <MessageBox>Theres no tournament for your league :(</MessageBox>;

  return (
    <ul className="flex flex-col gap-2">
      {data?.map((tournament) => (
        <TournamentCardLink key={tournament.id} tournament={tournament} />
      ))}
    </ul>
  );
}

function TournamentCardLink({ tournament }: { tournament: SwissTournament }) {
  return (
    <Link href={`/tournament/swiss/${tournament.id}`}>
      <TournamentCard tournament={tournament} />
    </Link>
  );
}
