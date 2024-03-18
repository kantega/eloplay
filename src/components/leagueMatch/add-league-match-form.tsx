import { type LeagueMatch, type TeamUser } from "@prisma/client";
import { ArrowLeftRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useState } from "react";
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
import LoadingSpinner from "../loading";
import { type LeagueUserAndTeamUser } from "../leagueUser/league-user-types";
import { useUserId } from "@/contexts/authContext/auth-provider";
// import MinorHeaderLabel from "../minor-header-label";

export default function AddLeagueMatchForm() {
  const [isOpen, setIsOpen] = useState(true);
  const userId = useUserId();
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const [winnerIdState, setWinnerIdState] = useState(userId);
  const [loserIdState, setLoserIdState] = useState(userId);

  const localKey = leagueId + "showInactivePlayers";
  const [showInactivePlayers, setShowInactivePlayers] = useState(
    getLocalStorageToggleValue(localKey),
  );
  const [recentOpponents, setRecentOpponents] = useState<string[]>(
    getLocalStorageRecentOpponents(leagueId),
  );

  const { data, isLoading } = api.leagueUser.getAllByLeagueId.useQuery({
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
      setLoserIdState(userId);

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

  if (!data || isLoading) return <LoadingSpinner />;

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
    setWinnerIdState(id);
  };

  const setLoserId = (id: string) => setLoserIdState(id);

  const createMatch = async () => {
    createMatchMutate.mutate({
      winnerId: winnerIdState,
      loserId: loserIdState,
      leagueId,
      teamId,
    });
  };

  return (
    <>
      <LocalStorageToggle
        isToggled={showInactivePlayers}
        setIsToggled={setShowInactivePlayers}
        localStorageKey={localKey}
        label="Show inactive players"
      />
      <div className="relative flex h-full w-full flex-row items-center justify-center space-y-4">
        <Button
          type="button"
          className="absolute right-[calc(50%-16px)] top-6 h-8 w-8 rounded-full bg-primary p-2 text-black"
          onClick={() => {
            const tempValue = winnerIdState;
            setWinnerIdState(loserIdState);
            setLoserIdState(tempValue);
          }}
        >
          <ArrowLeftRight />
        </Button>
        <div className="flex w-full flex-col gap-1">
          <Label>Winner</Label>
          <p>{winnerPlayer?.teamUser.gamerTag ?? "Pick winner"}</p>
        </div>
        <div className="flex w-full flex-col text-end">
          <Label>Loser</Label>
          <p>{loserPlayer?.teamUser.gamerTag ?? "Pick loser"}</p>
        </div>
      </div>
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
    </>
  );
}

import { Input } from "@/components/ui/input";
import { filterUsers } from "@/server/api/routers/leagueMatch/league-match-utils";
import { Label } from "../ui/label";
import { LocalStorageToggle } from "../ui-localstorage/localstorage-toggle";
import {
  getLocalStorageRecentOpponents,
  setLocalStorageRecentOpponents,
} from "./league-match-util";
import { getLocalStorageToggleValue } from "../ui-localstorage/localstorage-utils";
import TeamUserCard from "../teamUser/team-user-card";
import { Separator } from "../ui/separator";

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
      <div className="relative w-full">
        <Input
          tabIndex={-1}
          autoFocus={false}
          className="sticky top-16 z-10"
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
      <div className="flex h-[40dvh] w-full flex-col gap-4 overflow-scroll rounded-md border-2 border-solid border-background-secondary p-2">
        {sortedMembers.map((member) => (
          <>
            <PickWinnerOrLoser
              key={member.teamUser.userId}
              user={member}
              winnerId={winnerId}
              loserId={loserId}
              setWinnerId={setWinnerId}
              setLoserId={setLoserId}
            />
            <Separator />
          </>
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
              ? "border-2 border-solid border-primary bg-primary p-0 px-4 hover:bg-primary"
              : "border-2 border-solid border-primary"
          }
          variant="ghost"
          onClick={() => setWinnerId(user.teamUser.userId)}
        >
          W
        </Button>
        <Button
          type="button"
          className={
            loserId === user.teamUser.userId
              ? "border-2 border-solid border-red-500 bg-red-500 p-0 px-4 hover:bg-red-500"
              : "border-2 border-solid border-red-500"
          }
          variant="ghost"
          onClick={() => setLoserId(user.teamUser.userId)}
        >
          L
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
        <Button className="m-auto w-full justify-center text-black">
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
