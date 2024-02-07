"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { Check, ChevronsUpDown } from "lucide-react";

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
import { LocationContext } from "@/components/LangContext/LangContext";

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

  const players = playersQuery.data;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center justify-center gap-10 space-y-6"
      >
        <FormField
          control={form.control}
          name="player1Id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-2xl text-primary">Vinner</FormLabel>
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
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search player..." />
                    <CommandEmpty>No player found.</CommandEmpty>
                    <CommandGroup>
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
        {form.watch("player1Id") !== "" && (
          <FormField
            control={form.control}
            name="player2Id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-2xl text-destructive">
                  Taper
                </FormLabel>
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
                          ? players.find((player) => player.id === field.value)
                              ?.name
                          : "Select player"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search player..." />
                      <CommandEmpty>No player found.</CommandEmpty>
                      <CommandGroup>
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
        )}
        {/* todo: fix bug, you can select a office and press submit at the same time */}
        <Button type="submit" className=" m-auto w-fit">
          Legg til kamp
        </Button>
      </form>
    </Form>
  );
}
