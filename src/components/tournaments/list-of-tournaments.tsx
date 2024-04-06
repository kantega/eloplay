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
import { getLocalStorageToggleValue } from "../ui-localstorage/localstorage-utils";
import { LocalStorageCheckbox } from "../ui-localstorage/localstorage-checkbox";
import MinorHeaderLabel from "../minor-header-label";
import { Skeleton } from "../ui/skeleton";
import SearchBar from "../search-bar";

export default function ListOfTournaments() {
  const skeleton = <TournamentSkeleton />;

  return (
    <Suspense fallback={skeleton}>
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
  const [showCompleted, setShowCompleted] = useState(
    getLocalStorageToggleValue(keyShowCompleted),
  );
  const [showOpen, setShowOpen] = useState(
    getLocalStorageToggleValue(keyShowOpen, true),
  );

  const [showYours, setShowYours] = useState(
    getLocalStorageToggleValue(keyShowYours),
  );
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
      />
    </Link>
  );
}

function TournamentSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full delay-150" />
      <Skeleton className="h-20 w-full delay-300" />
    </div>
  );
}
