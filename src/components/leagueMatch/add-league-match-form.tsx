"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { ArrowLeftRight, ArrowUpRightFromSquare, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { CreateLeagueMatch } from "@/server/api/routers/leagueMatch/league-match-types";
import { useState } from "react";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import LeagueMatchCard from "@/components/leagueMatch/league-match-card";
import { sortAndFilterForInactivePlayers } from "../leagueUser/league-user-utils";

import LoadingSpinner from "../loading";
import { type LeagueUserAndTeamUser } from "../leagueUser/league-user-types";
import { useUserId } from "@/contexts/authContext/auth-provider";
import MinorHeaderLabel from "../minor-header-label";

export default function AddLeagueMatchForm() {
  const userId = useUserId();
  const teamId = useTeamId();
  const leagueId = useLeagueId();

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

  const form = useForm<z.infer<typeof CreateLeagueMatch>>({
    resolver: zodResolver(CreateLeagueMatch),
    defaultValues: {
      winnerId: userId,
      loserId: userId,
    },
  });
  const createMatchMutate = api.leagueMatch.create.useMutation({
    onSuccess: async () => {
      const winner = form.getValues("winnerId");
      const loser = form.getValues("loserId");

      if (winner !== userId) recentOpponents.unshift(winner);
      if (loser !== userId) recentOpponents.unshift(loser);

      setLocalStorageRecentOpponents(recentOpponents, leagueId);
      setRecentOpponents(getLocalStorageRecentOpponents(leagueId));

      form.reset();
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

  function onSubmit(data: z.infer<typeof CreateLeagueMatch>) {
    createMatchMutate.mutate({ ...data, teamId, leagueId });
  }

  if (!data || isLoading) return <LoadingSpinner />;

  const filtedLeagueUsers = sortAndFilterForInactivePlayers(
    data.leagueUsersAndTeamUsers,
    showInactivePlayers,
    userId,
  );

  const winnerPlayer = filtedLeagueUsers.find(
    (player) => player.teamUser.userId === form.getValues("winnerId"),
  );

  const loserPlayer = filtedLeagueUsers.find(
    (player) => player.teamUser.userId === form.getValues("loserId"),
  );

  const watchLoserId = form.watch("loserId");
  const watchWinnerId = form.watch("winnerId");

  const setWinnerId = (id: string) => {
    if (id === form.getValues("loserId")) form.setValue("loserId", "");
    form.setValue("winnerId", id);
  };

  const setLoserId = (id: string) => form.setValue("loserId", id);

  return (
    <>
      <LocalStorageToggle
        isToggled={showInactivePlayers}
        setIsToggled={setShowInactivePlayers}
        localStorageKey={localKey}
        label="Show inactive players"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative flex h-full w-full flex-col items-center justify-center space-y-4"
        >
          <Button
            type="button"
            className="absolute right-6 top-24 rotate-90 rounded-full bg-primary p-2 text-black"
            onClick={() => {
              const tempValue = form.getValues("winnerId");
              form.setValue("winnerId", form.getValues("loserId"));
              form.setValue("loserId", tempValue);
            }}
          >
            <ArrowLeftRight />
          </Button>
          <div className="flex w-full flex-col">
            <Label>Winner</Label>
            <PickOpponent
              teamUsers={filtedLeagueUsers}
              title={"Pick winner"}
              setPlayerId={setWinnerId}
            >
              <Button
                variant="outline"
                className="flex w-full justify-between"
                type="button"
              >
                <p>{winnerPlayer?.teamUser.gamerTag ?? "Pick winner"}</p>
                <ArrowUpRightFromSquare className="text-gray-700" />
              </Button>
            </PickOpponent>
          </div>
          <div className="flex w-full flex-col">
            <Label>Loser</Label>
            <PickOpponent
              teamUsers={filtedLeagueUsers}
              title={"Pick winner"}
              setPlayerId={setLoserId}
            >
              <Button
                type="button"
                variant="outline"
                className="flex w-full justify-between"
              >
                <p>{loserPlayer?.teamUser.gamerTag ?? "Pick loser"}</p>
                <ArrowUpRightFromSquare className="text-gray-700" />
              </Button>
            </PickOpponent>
          </div>
          {watchLoserId !== watchWinnerId &&
            watchLoserId !== "" &&
            watchWinnerId !== "" && (
              <Button
                disabled={createMatchMutate.isLoading}
                type="submit"
                className="m-auto w-full justify-center text-black"
              >
                {createMatchMutate.isLoading ? <LoadingSpinner /> : "Add match"}
              </Button>
            )}
          {!!winnerPlayer &&
            !!loserPlayer &&
            watchLoserId !== watchWinnerId && (
              <LeagueMatchCard
                winnerTeamUser={winnerPlayer.teamUser}
                loserTeamUser={loserPlayer.teamUser}
                match={{
                  preWinnerElo: winnerPlayer.leagueUser.elo,
                  preLoserElo: loserPlayer.leagueUser.elo,
                }}
                includeSeparator={false}
              />
            )}
        </form>
      </Form>
      {(!loserPlayer || !winnerPlayer || loserPlayer === winnerPlayer) && (
        <PickFromRecentOpponents
          users={filtedLeagueUsers}
          recentOpponents={recentOpponents}
          setWinnerId={setWinnerId}
          setLoserId={setLoserId}
        />
      )}
    </>
  );
}

function PickFromRecentOpponents({
  users,
  recentOpponents,
  setWinnerId,
  setLoserId,
}: {
  users: LeagueUserAndTeamUser[];
  recentOpponents: string[];
  setWinnerId: (id: string) => void;
  setLoserId: (id: string) => void;
}) {
  const recentOpponentsFiltered = users.filter((user) =>
    recentOpponents.includes(user.teamUser.userId),
  );

  if (recentOpponentsFiltered.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <MinorHeaderLabel headerText="Have you played more matches?" />
      <div className="flex w-full items-center justify-between">
        <p>Pick as winner</p>
        <p>Pick as loser</p>
      </div>
      {recentOpponentsFiltered.reverse().map((user) => (
        <div
          key={user.teamUser.userId}
          className="relative flex h-10 w-full items-center justify-center"
        >
          <Button
            className="absolute left-0 m-0 h-full w-2/5 bg-primary p-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => setWinnerId(user.teamUser.userId)}
          >
            {user.teamUser.gamerTag}
          </Button>
          <h1 className="z-20 text-5xl">|</h1>
          <Button
            className="absolute right-0 m-0 h-full w-2/5 bg-red-500 p-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => setLoserId(user.teamUser.userId)}
          >
            {user.teamUser.gamerTag}
          </Button>
        </div>
      ))}
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  type TeamMemberProps,
  filterTeamUsers,
} from "@/server/api/routers/leagueMatch/league-match-utils";
import { Label } from "../ui/label";
import { LocalStorageToggle } from "../ui-localstorage/localstorage-toggle";
import {
  getLocalStorageRecentOpponents,
  setLocalStorageRecentOpponents,
} from "./league-match-util";
import { getLocalStorageToggleValue } from "../ui-localstorage/localstorage-utils";

function PickOpponent({
  teamUsers,
  children,
  title,
  setPlayerId,
}: {
  teamUsers: LeagueUserAndTeamUser[];
  children: React.ReactNode;
  title: string;
  setPlayerId: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const membersList: TeamMemberProps[] = teamUsers.map((teamUser) => ({
    ...teamUser.teamUser,
    role: "MEMBER",
  }));

  const filteredMembers = filterTeamUsers(membersList, searchQuery);

  const sortedMembers = filteredMembers.sort((a, b) =>
    a.gamerTag.localeCompare(b.gamerTag),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="my-4" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95%] rounded-sm sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative">
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
        <MinorHeaderLabel headerText="Members" />
        <div className="flex h-[55dvh] w-full flex-col gap-1 overflow-scroll rounded-md border-2 border-solid border-background-secondary p-2">
          {sortedMembers.map((member) => (
            <Button
              variant="outline"
              key={member.gamerTag}
              onClick={() => {
                setPlayerId(member.userId);
                setIsOpen(!isOpen);
              }}
            >
              {member.gamerTag}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
