import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import { api } from "@/utils/api";
import {
  type SwissTournamentUser,
  type MatchStatus,
  type SwissTournament,
  type SwissTournamentMatch,
  type TeamUser,
} from "@prisma/client";

import { useUserId } from "@/contexts/authContext/auth-provider";
import MinorHeaderLabel from "@/components/minor-header-label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import MessageBox from "../message-box";
import { Timer } from "lucide-react";
import { userIsTournamentModerator } from "@/utils/role";
import { useTeamRole } from "@/contexts/teamContext/team-provider";
import RegisterSwissMatchDialog from "./register-swiss-match";
import { SwissUserCard } from "./swiss-user-card";

export default function SwissTournamentMatches({
  matches,
  teamUsers,
  swissUsers,
  tournament,
}: {
  matches: SwissTournamentMatch[];
  teamUsers: TeamUser[];
  swissUsers: SwissTournamentUser[];
  tournament: SwissTournament;
}) {
  const [round, setRound] = useState(
    tournament.currentRound > tournament.roundLimit
      ? tournament.roundLimit
      : tournament.currentRound,
  );
  const [filteredMatches, setFilteredMatches] = useState(matches);

  useMemo(() => {
    setFilteredMatches(matches.filter((match) => match.round === round));
  }, [matches, round]);

  return (
    <div className="flex h-full flex-col gap-4">
      <YourMatch
        matches={filteredMatches}
        teamUsers={teamUsers}
        swissUsers={swissUsers}
      />
      <AllMatches
        matches={filteredMatches}
        teamUsers={teamUsers}
        swissUsers={swissUsers}
        ownerId={tournament.userId}
      />
      <SwissRoundPagination
        round={round}
        setRound={setRound}
        currentRound={tournament.currentRound}
        maxRounds={tournament.roundLimit}
        status={tournament.status as MatchStatus}
      />
    </div>
  );
}

function YourMatch({
  matches,
  teamUsers,
  swissUsers,
}: {
  matches: SwissTournamentMatch[];
  swissUsers: SwissTournamentUser[];
  teamUsers: TeamUser[];
}) {
  const userId = useUserId();

  const match = matches.find((match) => {
    return match.userId1 === userId || match.userId2 === userId;
  });

  if (!match) return null;

  const teamUser1 = teamUsers.find((user) => user.userId === match.userId1);
  const swissUser1 = swissUsers.find((user) => user.userId === match.userId1);
  const teamUser2 = teamUsers.find((user) => user.userId === match.userId2);
  const swissUser2 = swissUsers.find((user) => user.userId === match.userId2);

  if (!teamUser1 || !teamUser2 || !swissUser1 || !swissUser2) return null;

  return (
    <>
      <div>
        <MinorHeaderLabel
          headerText="Your match for this round"
          label="You can click on your match to register a result"
        />
        <RegisterSwissMatchDialog
          match={match}
          teamUser1={teamUser1}
          teamUser2={teamUser2}
          swissUser1={swissUser1}
          swissUser2={swissUser2}
        >
          <SwissMatchCard
            match={match}
            teamUser1={teamUser1}
            teamUser2={teamUser2}
            swissUser1={swissUser1}
            swissUser2={swissUser2}
          />
        </RegisterSwissMatchDialog>
      </div>
      <Separator />
    </>
  );
}

function AllMatches({
  matches,
  teamUsers,
  swissUsers,
  ownerId,
}: {
  matches: SwissTournamentMatch[];
  teamUsers: TeamUser[];
  swissUsers: SwissTournamentUser[];
  ownerId: string;
}) {
  const role = useTeamRole();
  const userId = useUserId();

  if (matches.length === 0)
    return (
      <MessageBox>
        No matches for this round yet <Timer />
      </MessageBox>
    );

  return (
    <>
      <div>
        <MinorHeaderLabel headerText="All matches for this round" />
        {matches.map((match) => {
          const teamUser1 = teamUsers.find(
            (user) => user.userId === match.userId1,
          );
          const swissUser1 = swissUsers.find(
            (user) => user.userId === match.userId1,
          );
          const teamUser2 = teamUsers.find(
            (user) => user.userId === match.userId2,
          );
          const swissUser2 = swissUsers.find(
            (user) => user.userId === match.userId2,
          );

          const usersExist =
            !!teamUser1 && !!teamUser2 && !!swissUser1 && !!swissUser2;

          const isModerator = userIsTournamentModerator({
            userId,
            ownerId,
            userRole: role,
          });

          if (!usersExist) return null;
          if (isModerator)
            return (
              <RegisterSwissMatchDialog
                match={match}
                teamUser1={teamUser1}
                teamUser2={teamUser2}
                swissUser1={swissUser1}
                swissUser2={swissUser2}
              >
                <SwissMatchCard
                  key={match.id}
                  match={match}
                  teamUser1={teamUser1}
                  teamUser2={teamUser2}
                  swissUser1={swissUser1}
                  swissUser2={swissUser2}
                />
              </RegisterSwissMatchDialog>
            );

          return (
            <SwissMatchCard
              key={match.id}
              match={match}
              teamUser1={teamUser1}
              teamUser2={teamUser2}
              swissUser1={swissUser1}
              swissUser2={swissUser2}
            />
          );
        })}
      </div>
    </>
  );
}

export function SwissMatchCard({
  match,
  teamUser1,
  teamUser2,
  swissUser1,
  swissUser2,
}: {
  match: SwissTournamentMatch;
  teamUser1: TeamUser;
  teamUser2: TeamUser;
  swissUser1: SwissTournamentUser;
  swissUser2: SwissTournamentUser;
}) {
  return (
    <Card className="relative w-full overflow-hidden">
      <div className="flex w-full flex-col justify-between bg-background-secondary">
        <div className="flex w-full items-center justify-around">
          <SwissUserCard
            teamUser={teamUser1}
            swissUser={swissUser1}
            match={match}
          />
          <p className="text-sm">vs.</p>
          <SwissUserCard
            teamUser={teamUser2}
            swissUser={swissUser2}
            match={match}
          />
        </div>
      </div>
    </Card>
  );
}

function SwissRoundPagination({
  round,
  setRound,
  currentRound,
  maxRounds,
  status,
}: {
  round: number;
  setRound: (round: number) => void;
  currentRound: number;
  maxRounds: number;
  status: MatchStatus;
}) {
  const setPrevious = () => {
    if (round > 1) {
      setRound(round - 1);
    }
  };

  const setNext = () => {
    if (round < maxRounds) {
      setRound(round + 1);
    }
  };

  const indexes = new Array(5).fill(0);

  return (
    <Pagination className="fixed bottom-20 left-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={setPrevious} />
        </PaginationItem>
        {indexes.map((_, index) => {
          const roundNumber = 1 + index + round - 3;
          if (roundNumber < 1) return null;
          if (roundNumber > maxRounds) return null;
          return (
            <PaginationItem key={roundNumber}>
              <PaginationLink
                className={
                  currentRound > roundNumber || status === "COMPLETED"
                    ? roundNumber === round
                      ? "border-primary bg-background-tertiary"
                      : "bg-primary"
                    : roundNumber === round
                      ? "bg-background-tertiary"
                      : ""
                }
                onClick={() => {
                  setRound(roundNumber);
                }}
                isActive={roundNumber === round}
              >
                R{roundNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext onClick={setNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
