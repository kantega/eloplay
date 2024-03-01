import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { type SwissTournament } from "@prisma/client";
import { useContext } from "react";
import Link from "next/link";
import LoadingSpinner from "../loading";
import MessageBox from "../message-box";
import TournamentCard from "./tournament-card";

export default function ListOfTournaments() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);

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
