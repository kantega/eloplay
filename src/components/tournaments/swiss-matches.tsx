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
import { userIsTournamentModerator } from "@/components/auhtVisibility/role";
import { useTeamRole } from "@/contexts/teamContext/team-provider";
import RegisterSwissMatchDialog from "./register-swiss-match";
import { SwissUserCard } from "./swiss-user-card";
import VersusSVG from "@/assets/versusSVG";
import { cn } from "@/lib/utils";

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
    <>
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
    </>
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
      <div className="space-y-2">
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
                key={match.id}
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
  const winner1 = match.winnerId === match.userId1;
  const winner2 = match.winnerId === match.userId2;
  const leftSide = winner1
    ? "bg-green-500 border-t-green-500 border-l-green-500"
    : winner2
      ? "bg-red-500 border-t-red-500 border-l-red-500"
      : "bg-background-tertiary border-t-background-tertiary border-l-background-tertiary";
  const rightSide = winner2
    ? "bg-green-500 border-b-green-500 border-r-green-500"
    : winner1
      ? "bg-red-500 border-b-red-500 border-r-red-500"
      : "bg-background-secondary border-b-background-secondary border-r-background-secondary";

  return (
    <Card className={cn("relative h-32 w-full overflow-hidden", rightSide)}>
      <div className={cn("absolute h-32 w-1/2", leftSide)}></div>
      <SwissUserCard
        teamUser={teamUser1}
        swissUser={swissUser1}
        className="absolute left-0  z-30 bg-transparent"
      />
      <div
        className={cn(
          "absolute left-[calc(50%-4rem)] top-0 flex h-32 w-32 items-center justify-center border-b-[4rem] border-l-[4rem] border-r-[4rem] border-t-[4rem] border-b-background-secondary border-l-background-tertiary border-r-background-secondary border-t-background-tertiary text-center",
          rightSide,
          leftSide,
        )}
      />
      <VersusSVG
        size={60}
        relativeSize={false}
        className="absolute left-[calc(50%-30px)] top-[calc(50%-35px)]"
      />
      <SwissUserCard
        teamUser={teamUser2}
        swissUser={swissUser2}
        className="absolute bottom-0 right-0 z-30 bg-transparent"
      />
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
    <Pagination className="fixed bottom-28 left-0 z-50 bg-background-secondary py-2">
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
