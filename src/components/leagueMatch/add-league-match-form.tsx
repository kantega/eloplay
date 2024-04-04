import { type LeagueMatch, type TeamUser } from "@prisma/client";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { Suspense, useState } from "react";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import LeagueMatchCard from "@/components/leagueMatch/league-match-card";
import { sortAndFilterForInactivePlayers } from "../leagueUser/league-user-utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import LoadingSpinner from "../loader/loading";
import { type LeagueUserAndTeamUser } from "../leagueUser/league-user-types";
import { useUserId } from "@/contexts/authContext/auth-provider";
import { Input } from "@/components/ui/input";
import { filterUsers } from "@/server/api/routers/leagueMatch/league-match-utils";
import { LocalStorageToggle } from "../ui-localstorage/localstorage-toggle";
import {
  getLocalStorageRecentOpponents,
  setLocalStorageRecentOpponents,
} from "./league-match-util";
import { getLocalStorageToggleValue } from "../ui-localstorage/localstorage-utils";
import TeamUserCard from "../teamUser/team-user-card";
import { Skeleton } from "../ui/skeleton";

export default function AddLeagueMatchForm() {
  return (
    <Suspense fallback={<Skeleton className="h-[60vh] w-full " />}>
      <AddLeagueMatchFormContent />
    </Suspense>
  );
}

function AddLeagueMatchFormContent() {
  const [isOpen, setIsOpen] = useState(true);
  const userId = useUserId();
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const [winnerIdState, setWinnerIdState] = useState(userId);
  const [loserIdState, setLoserIdState] = useState("");

  const localKey = leagueId + "showInactivePlayers";
  const [showInactivePlayers, setShowInactivePlayers] = useState(
    getLocalStorageToggleValue(localKey),
  );
  const [recentOpponents, setRecentOpponents] = useState<string[]>(
    getLocalStorageRecentOpponents(leagueId),
  );

  const [data] = api.leagueUser.getAllByLeagueId.useSuspenseQuery({
    teamId,
    leagueId,
  });

  const createMatchMutate = api.leagueMatch.create.useMutation({
    onSuccess: async () => {
      const winner = winnerIdState;
      const loser = loserIdState;

      if (winner !== userId) recentOpponents.unshift(winner);
      if (loser !== userId) recentOpponents.unshift(loser);

      setLocalStorageRecentOpponents(recentOpponents, leagueId);
      setRecentOpponents(getLocalStorageRecentOpponents(leagueId));

      setIsOpen(true);
      setWinnerIdState(userId);
      setLoserIdState("");

      toast({
        title: "Success",
        description: `New match registered.`,
        variant: "success",
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      console.log(errorMessage);
      toast({
        title: "Error",
        description:
          errorMessage?.title ??
          errorMessage?.description ??
          "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const filtedLeagueUsers = sortAndFilterForInactivePlayers(
    data.leagueUsersAndTeamUsers,
    showInactivePlayers,
    userId,
  );

  const winnerPlayer = filtedLeagueUsers.find(
    (player) => player.teamUser.userId === winnerIdState,
  );

  const loserPlayer = filtedLeagueUsers.find(
    (player) => player.teamUser.userId === loserIdState,
  );

  const setWinnerId = (id: string) => {
    if (id === loserIdState) setLoserIdState("");
    if (loserIdState === "" && winnerIdState !== "" && id !== loserIdState) {
      setLoserIdState(winnerIdState);
      setWinnerIdState(id);
    }
    if (winnerIdState !== "" && loserIdState !== "" && id === loserIdState) {
      setLoserIdState(winnerIdState);
      setWinnerIdState(id);
    } else setWinnerIdState(id);
  };

  const setLoserId = (id: string) => {
    if (id === winnerIdState) setWinnerIdState("");
    if (winnerIdState === "" && loserIdState !== "" && id !== winnerIdState) {
      setWinnerIdState(loserIdState);
      setLoserIdState(id);
    }
    if (winnerIdState !== "" && loserIdState !== "" && id === winnerIdState) {
      setWinnerIdState(loserIdState);
      setLoserIdState(id);
    } else setLoserIdState(id);
  };

  const createMatch = async () => {
    createMatchMutate.mutate({
      winnerId: winnerIdState,
      loserId: loserIdState,
      leagueId,
      teamId,
    });
  };

  return (
    <div className="relative flex flex-col gap-2">
      <LocalStorageToggle
        isToggled={showInactivePlayers}
        setIsToggled={setShowInactivePlayers}
        localStorageKey={localKey}
        label="Show inactive players"
      />
      <NewPickOpponent
        teamUsers={filtedLeagueUsers}
        winnerId={winnerIdState}
        loserId={loserIdState}
        setWinnerId={setWinnerId}
        setLoserId={setLoserId}
      />
      {!!winnerPlayer && !!loserPlayer && loserIdState !== winnerIdState && (
        <AddMatchDrawer
          winnerTeamUser={winnerPlayer.teamUser}
          loserTeamUser={loserPlayer.teamUser}
          match={{
            preWinnerElo: winnerPlayer.leagueUser.elo,
            preLoserElo: loserPlayer.leagueUser.elo,
          }}
          includeSeparator={false}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isLoading={createMatchMutate.isLoading}
          createMatch={createMatch}
        />
      )}
      <p className="m-10"></p>
    </div>
  );
}

function NewPickOpponent({
  teamUsers,
  winnerId,
  loserId,
  setWinnerId,
  setLoserId,
}: {
  teamUsers: LeagueUserAndTeamUser[];
  winnerId: string;
  loserId: string;
  setWinnerId: (id: string) => void;
  setLoserId: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = filterUsers(teamUsers, searchQuery);

  const sortedMembers = filteredMembers.sort((a, b) =>
    a.teamUser.gamerTag.localeCompare(b.teamUser.gamerTag),
  );

  return (
    <>
      <div className="sticky top-16 z-10 w-full">
        <Input
          tabIndex={-1}
          autoFocus={false}
          placeholder="search for opponent..."
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value.currentTarget.value);
          }}
        />
        <Button
          className="absolute right-0 top-0 z-20"
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setSearchQuery("");
          }}
        >
          <XCircle className="text-red-500" />
        </Button>
      </div>
      <div className="min-h-[70dvh flex w-full flex-col gap-4 overflow-scroll rounded-md border-2 border-solid border-background-secondary p-2">
        {sortedMembers.map((member) => (
          <PickWinnerOrLoser
            key={member.teamUser.userId + "-pick"}
            user={member}
            winnerId={winnerId}
            loserId={loserId}
            setWinnerId={setWinnerId}
            setLoserId={setLoserId}
          />
        ))}
      </div>
    </>
  );
}

function PickWinnerOrLoser({
  user,
  winnerId,
  loserId,
  setWinnerId,
  setLoserId,
}: {
  user: LeagueUserAndTeamUser;
  winnerId: string;
  loserId: string;
  setWinnerId: (id: string) => void;
  setLoserId: (id: string) => void;
}) {
  return (
    <div className="flex h-10 w-full items-center justify-between">
      <TeamUserCard player={user} />
      <div className="flex gap-2">
        <Button
          type="button"
          className={
            winnerId === user.teamUser.userId
              ? "w-20 border-2 border-solid border-primary bg-primary p-0 px-4  transition-all hover:bg-primary"
              : "w-2 border-2 border-solid border-primary  transition-all"
          }
          variant="ghost"
          onClick={() => setWinnerId(user.teamUser.userId)}
        >
          {winnerId === user.teamUser.userId ? "Winner" : "W"}
        </Button>
        <Button
          type="button"
          className={
            loserId === user.teamUser.userId
              ? "w-20 border-2 border-solid border-red-500 bg-red-500 p-0 px-4 transition-all hover:bg-red-500"
              : "w-2 border-2 border-solid border-red-500  transition-all"
          }
          variant="ghost"
          onClick={() => setLoserId(user.teamUser.userId)}
        >
          {loserId === user.teamUser.userId ? "Loser" : "L"}
        </Button>
      </div>
    </div>
  );
}

export function AddMatchDrawer({
  winnerTeamUser,
  loserTeamUser,
  match,
  includeSeparator,
  isOpen,
  setIsOpen,
  isLoading,
  createMatch,
}: {
  winnerTeamUser: TeamUser;
  loserTeamUser: TeamUser;
  match: LeagueMatch | { preWinnerElo: number; preLoserElo: number };
  includeSeparator?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  createMatch: () => void;
}) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="sticky bottom-20 z-30 m-auto w-full justify-center text-black">
          Add match
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto my-10 w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-4xl text-primary">
              Register match
            </DrawerTitle>
          </DrawerHeader>
          <LeagueMatchCard
            winnerTeamUser={winnerTeamUser}
            loserTeamUser={loserTeamUser}
            match={match}
            includeSeparator={includeSeparator}
          />
          <DrawerFooter>
            <Button
              disabled={isLoading}
              type="submit"
              className="m-auto w-full justify-center text-black"
              onClick={createMatch}
            >
              {isLoading ? <LoadingSpinner /> : "Add match"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
