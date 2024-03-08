import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import { type SwissTournament } from "@prisma/client";
import Link from "next/link";
import LoadingSpinner from "../loading";
import MessageBox from "../message-box";
import TournamentCard from "./tournament-card";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import {
  LocalStorageToggle,
  getLocalStorageToggleValue,
} from "../localstorage-toggle";
import { filterTournaments } from "./tournament-util";

export default function ListOfTournaments() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const keyShowCompleted = leagueId + "showCompletedTournaments";
  const keyShowOpen = leagueId + "showOpen";

  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(
    getLocalStorageToggleValue(keyShowCompleted),
  );
  const [showOpen, setShowOpen] = useState(
    getLocalStorageToggleValue(keyShowOpen),
  );
  const [tournaments, setTournaments] = useState<SwissTournament[]>([]);

  const { data, isLoading } = api.swissTournament.getAll.useQuery({
    teamId,
    leagueId,
  });

  useMemo(() => {
    if (!data) return;
    let newData = data;
    if (searchQuery !== "") newData = filterTournaments(data, searchQuery);
    if (!showCompleted)
      newData = newData.filter((t) => t.status !== "COMPLETED");
    if (!showOpen) newData = newData.filter((t) => !t.isOpen);

    setTournaments(newData);
  }, [data, searchQuery, showCompleted, showOpen]);

  if (isLoading) return <LoadingSpinner />;
  if (!data)
    return <MessageBox>Theres no tournament for your league :(</MessageBox>;

  return (
    <>
      <Input
        tabIndex={-1}
        autoFocus={false}
        className="sticky top-16 z-10"
        placeholder="search for tournament..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
      />
      <div className="flex gap-2">
        <LocalStorageToggle
          isToggled={showOpen}
          setIsToggled={setShowOpen}
          localStorageKey={keyShowOpen}
          label="Open for registration"
        />
        <LocalStorageToggle
          isToggled={showCompleted}
          setIsToggled={setShowCompleted}
          localStorageKey={keyShowCompleted}
          label="Completed"
        />
      </div>

      <ul className="flex flex-col gap-2">
        {tournaments.map((tournament) => (
          <TournamentCardLink key={tournament.id} tournament={tournament} />
        ))}
      </ul>
    </>
  );
}

function TournamentCardLink({ tournament }: { tournament: SwissTournament }) {
  return (
    <Link href={`/tournament/swiss/${tournament.id}`}>
      <TournamentCard tournament={tournament} />
    </Link>
  );
}
