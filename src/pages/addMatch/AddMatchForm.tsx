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
import { CreateMatch } from "@/server/types/matchTypes";
import { useContext, useState } from "react";
import { LocationContext } from "@/contexts/locationContext/location-provider";
import { sortPlayersByName } from "@/utils/player";
import { updateEloRating } from "@/utils/elo";
import { type TableTennisPlayer } from "@prisma/client";

export default function AddMatchForm() {
  const { location } = useContext(LocationContext);
  const [popoverWinnerOpen, setPopoverWinnerOpen] = useState(false);
  const [popoverLoserOpen, setPopoverLoserOpen] = useState(false);

  const playersQuery = api.player.findAll.useQuery({ office: location });
  const form = useForm<z.infer<typeof CreateMatch>>({
    resolver: zodResolver(CreateMatch),
    defaultValues: {
      player1Id: "",
      player2Id: "",
    },
  });
  const createMatch = api.match.create.useMutation({
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

  function onSubmit(data: z.infer<typeof CreateMatch>) {
    createMatch.mutate(data);
  }

  if (!playersQuery.data || playersQuery.isLoading) return null;

  const players = sortPlayersByName(playersQuery.data);

  const winnerPlayer = players.find(
    (player) => player.id === form.getValues("player1Id"),
  );

  const loserPlayer = players.find(
    (player) => player.id === form.getValues("player2Id"),
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
            name="player1Id"
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
                          ? players.find((player) => player.id === field.value)
                              ?.name
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
                            value={player.name}
                            key={player.id}
                            onSelect={() => {
                              if (player.id === form.getValues("player2Id"))
                                form.setValue("player2Id", "");

                              form.setValue(
                                "player2Id",
                                form.getValues("player2Id"),
                              );
                              form.setValue("player1Id", player.id);
                              setPopoverWinnerOpen(false);
                              if (form.getValues("player2Id") === "")
                                setPopoverLoserOpen(true);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                player.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {player.name}
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
        {form.watch("player1Id") !== "" && (
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="player2Id"
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
                                (player) => player.id === field.value,
                              )?.name
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
                            if (player.id === form.getValues("player1Id"))
                              return null;

                            return (
                              <CommandItem
                                value={player.name}
                                key={player.id}
                                onSelect={() => {
                                  form.setValue("player2Id", player.id);
                                  setPopoverLoserOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    player.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {player.name}
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
  winnerPlayer?: TableTennisPlayer;
  loserPlayer?: TableTennisPlayer;
  showLoser?: boolean;
}) {
  if (showLoser)
    return (
      <>
        {winnerPlayer && loserPlayer && (
          <p className="flex items-center justify-center gap-2 text-sm">
            <b>{loserPlayer.elo}</b>
            <ArrowRight className=" scale-75" />
            <b className="text-red-600">
              {updateEloRating(winnerPlayer.elo, loserPlayer.elo)[1]}
            </b>
            <b className="text-red-600">
              {" (" +
                (updateEloRating(winnerPlayer.elo, loserPlayer.elo)[1] -
                  loserPlayer.elo) +
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
          <b>{winnerPlayer.elo}</b>
          <ArrowRight className=" scale-75" />
          <b className="text-green-600">
            {updateEloRating(winnerPlayer.elo, loserPlayer.elo)[0]}
          </b>
          <b className="text-green-600">
            {" (+" +
              (updateEloRating(winnerPlayer.elo, loserPlayer.elo)[0] -
                winnerPlayer.elo) +
              ")"}
          </b>
        </p>
      )}
    </>
  );
}
