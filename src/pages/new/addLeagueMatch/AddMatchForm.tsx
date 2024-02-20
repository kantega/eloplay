"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { type CreateLeagueMatch, CreateMatch } from "@/server/types/matchTypes";
import { useContext, useState } from "react";
import {
  type TeamUserWithLeagueUser,
  sortTeamUsersByGamerTag,
} from "@/utils/player";
import { updateEloRating } from "@/utils/elo";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";

export default function AddMatchForm() {
  const { teamId } = useContext(TeamContext);
  const { leagueId } = useContext(LeagueContext);
  const [popoverWinnerOpen, setPopoverWinnerOpen] = useState(false);
  const [popoverLoserOpen, setPopoverLoserOpen] = useState(false);

  const { data, isLoading } = api.teamUser.getAll.useQuery({
    id: teamId,
    leagueId,
  });
  const form = useForm<z.infer<typeof CreateLeagueMatch>>({
    resolver: zodResolver(CreateMatch),
    defaultValues: {
      winnerId: "",
      loserId: "",
    },
  });
  const createMatch = api.leagueMatch.create.useMutation({
    onSuccess: async () => {
      form.reset();
      toast({
        title: "Success",
        description: "Match registered.",
        variant: "default",
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
    createMatch.mutate({ ...data, id: teamId, leagueId });
  }

  if (!data || isLoading) return null;

  const players = sortTeamUsersByGamerTag(data);

  const winnerPlayer = players.find(
    (player) => player.teamUser.userId === form.getValues("winnerId"),
  );

  const loserPlayer = players.find(
    (player) => player.teamUser.userId === form.getValues("loserId"),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center justify-center gap-4 space-y-6"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="winnerId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-2xl text-green-600">
                  Vinner
                </FormLabel>
                <Popover
                  open={popoverWinnerOpen}
                  onOpenChange={setPopoverWinnerOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? players.find(
                              (player) =>
                                player.teamUser.userId === field.value,
                            )?.teamUser.gamerTag
                          : "Select player"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="h-52 w-[200px] p-0">
                    <Command>
                      <CommandInput
                        className="placeholder-green-600"
                        placeholder="Velg vinner..."
                      />
                      <CommandEmpty>No player found.</CommandEmpty>
                      <CommandGroup className="overflow-y-scroll">
                        {players.map((player) => (
                          <CommandItem
                            value={player.teamUser.gamerTag}
                            key={player.teamUser.userId}
                            onSelect={() => {
                              if (
                                player.teamUser.userId ===
                                form.getValues("loserId")
                              )
                                form.setValue("loserId", "");

                              form.setValue(
                                "loserId",
                                form.getValues("loserId"),
                              );
                              form.setValue("winnerId", player.teamUser.userId);
                              setPopoverWinnerOpen(false);
                              if (form.getValues("loserId") === "")
                                setPopoverLoserOpen(true);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                player.teamUser.userId === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {player.teamUser.gamerTag}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <EloGainLoss winnerPlayer={winnerPlayer} loserPlayer={loserPlayer} />
        </div>
        {form.watch("winnerId") !== "" && (
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="loserId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-2xl text-red-600">Taper</FormLabel>
                  <Popover
                    open={popoverLoserOpen}
                    onOpenChange={setPopoverLoserOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? players.find(
                                (player) =>
                                  player.teamUser.userId === field.value,
                              )?.teamUser.gamerTag
                            : "Select player"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="h-52 w-[200px] p-0">
                      <Command>
                        <CommandInput
                          className="placeholder-red-600"
                          placeholder="Velg taper..."
                        />
                        <CommandEmpty>No player found.</CommandEmpty>
                        <CommandGroup className="overflow-y-scroll">
                          {players.map((player) => {
                            if (
                              player.teamUser.userId ===
                              form.getValues("winnerId")
                            )
                              return null;

                            return (
                              <CommandItem
                                value={player.teamUser.gamerTag}
                                key={player.teamUser.userId}
                                onSelect={() => {
                                  form.setValue(
                                    "loserId",
                                    player.teamUser.userId,
                                  );
                                  setPopoverLoserOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    player.teamUser.userId === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {player.teamUser.gamerTag}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <EloGainLoss
              winnerPlayer={winnerPlayer}
              loserPlayer={loserPlayer}
              showLoser={true}
            />
          </div>
        )}
        <Button type="submit" className=" m-auto w-fit">
          Legg til kamp
        </Button>
      </form>
    </Form>
  );
}

function EloGainLoss({
  winnerPlayer,
  loserPlayer,
  showLoser = false,
}: {
  winnerPlayer?: TeamUserWithLeagueUser;
  loserPlayer?: TeamUserWithLeagueUser;
  showLoser?: boolean;
}) {
  if (showLoser)
    return (
      <>
        {winnerPlayer && loserPlayer && (
          <p className="flex items-center justify-center gap-2 text-sm">
            <b>{loserPlayer.teamUser.gamerTag}</b>
            <ArrowRight className=" scale-75" />
            <b className="text-red-600">
              {
                updateEloRating(
                  winnerPlayer.leagueUser.elo,
                  loserPlayer.leagueUser.elo,
                )[1]
              }
            </b>
            <b className="text-red-600">
              {" (" +
                (updateEloRating(
                  winnerPlayer.leagueUser.elo,
                  loserPlayer.leagueUser.elo,
                )[1] -
                  loserPlayer.leagueUser.elo) +
                ")"}
            </b>
          </p>
        )}
      </>
    );

  return (
    <>
      {winnerPlayer && loserPlayer && (
        <p className="flex items-center justify-center gap-2 text-sm">
          <b>{winnerPlayer.teamUser.gamerTag}</b>
          <ArrowRight className=" scale-75" />
          <b className="text-green-600">
            {
              updateEloRating(
                winnerPlayer.leagueUser.elo,
                loserPlayer.leagueUser.elo,
              )[0]
            }
          </b>
          <b className="text-green-600">
            {" (+" +
              (updateEloRating(
                winnerPlayer.leagueUser.elo,
                loserPlayer.leagueUser.elo,
              )[0] -
                winnerPlayer.leagueUser.elo) +
              ")"}
          </b>
        </p>
      )}
    </>
  );
}
