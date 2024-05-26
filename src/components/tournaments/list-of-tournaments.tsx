import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { api } from "@/utils/api";
import {
  type TeamUser,
  type SwissTournament,
  type SwissTournamentUser,
} from "@prisma/client";
import Link from "next/link";
import MessageBox from "../message-box";
import TournamentCard from "./tournament-card";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { Suspense, useMemo, useState } from "react";
import { filterTournaments } from "./tournament-util";
import { useLocalBoolean } from "../ui-localstorage/localstorage-utils";
import { LocalStorageCheckbox } from "../ui-localstorage/localstorage-checkbox";
import MinorHeaderLabel from "../minor-header-label";
import SearchBar from "../search-bar";
import TournamentSkeleton from "../skeletons/tournament-skeleton";

export default function ListOfTournaments() {
  return (
    <Suspense fallback={<TournamentSkeleton />}>
      <ListOfTournamentsContent />
    </Suspense>
  );
}

function ListOfTournamentsContent() {
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const keyShowCompleted = leagueId + "showCompletedTournaments";
  const keyShowOpen = leagueId + "showOpen";
  const keyShowYours = leagueId + "showYours";

  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useLocalBoolean(keyShowCompleted);
  const [showOpen, setShowOpen] = useLocalBoolean(keyShowOpen, true);
  const [showYours, setShowYours] = useLocalBoolean(keyShowYours);
  const [tournaments, setTournaments] = useState<SwissTournament[]>([]);

  const [data] = api.swissTournament.getAll.useSuspenseQuery({
    teamId,
    leagueId,
  });

  useMemo(() => {
    if (!data) return;
    let newData = data.tournaments;
    if (searchQuery !== "") newData = filterTournaments(newData, searchQuery);
    if (!showCompleted)
      newData = newData.filter((t) => t.status !== "COMPLETED");
    if (!showOpen) newData = newData.filter((t) => !t.isOpen);
    if (showYours)
      newData = newData.filter(
        (t) =>
          data.swissProfiles.find((s) => s.swissTournamentId === t.id) !==
          undefined,
      );

    setTournaments(newData);
  }, [data, searchQuery, showCompleted, showOpen, showYours]);

  if (!data)
    return <MessageBox>Theres no tournament for your league :(</MessageBox>;

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={"Search for tournament..."}
      />
      <MinorHeaderLabel headerText="Filter type of tournament" />
      <div className="flex flex-wrap gap-4">
        <LocalStorageCheckbox
          isToggled={showOpen}
          setIsToggled={setShowOpen}
          localStorageKey={keyShowOpen}
          label="Registration"
        />
        <LocalStorageCheckbox
          isToggled={showCompleted}
          setIsToggled={setShowCompleted}
          localStorageKey={keyShowCompleted}
          label="Completed"
        />
        <LocalStorageCheckbox
          isToggled={showYours}
          setIsToggled={setShowYours}
          localStorageKey={keyShowYours}
          label="Includes you"
        />
      </div>

      <ul className="flex flex-col gap-2">
        {tournaments.map((tournament) => {
          const swissUser = data.swissProfiles.find(
            (s) => s.swissTournamentId === tournament.id,
          );

          return (
            <TournamentCardLink
              key={tournament.id}
              tournament={tournament}
              swissUser={swissUser}
              teamUser={data.teamUser ?? undefined}
            />
          );
        })}
      </ul>
    </>
  );
}

function TournamentCardLink({
  tournament,
  swissUser,
  teamUser,
}: {
  tournament: SwissTournament;
  swissUser?: SwissTournamentUser;
  teamUser?: TeamUser;
}) {
  return (
    <Link href={`/tournament/swiss/${tournament.id}`}>
      <TournamentCard
        tournament={tournament}
        swissUser={swissUser}
        teamUser={teamUser}
        showDelete={false}
      />
    </Link>
  );
}
