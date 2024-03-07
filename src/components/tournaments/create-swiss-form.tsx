"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import LoadingSpinner from "../loading";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { CreateSwissTournament } from "@/server/api/routers/swissTournament/swiss-tournament-types";
import { Switch } from "../ui/switch";
import ShowPickedMembers from "./show-picked-members";
import MessageBox from "../message-box";
import router from "next/router";
import { useTeamId } from "@/contexts/teamContext/team-provider";

export default function CreateSwissForm() {
  const leagueId = useLeagueId();
  const teamId = useTeamId();
  const form = useForm<z.infer<typeof CreateSwissTournament>>({
    resolver: zodResolver(CreateSwissTournament),
    defaultValues: {
      name: "",
      leagueId,
      teamId,
      isOpen: true,
      participants: [],
    },
  });
  const createSwissTournament = api.swissTournament.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Swiss tournament created.",
        description: `Swiss tournament: ${form.getValues("name")}.`,
        variant: "success",
      });

      form.reset();
      void router.push(`/tournament/swiss/${data.swissTournament.id}`);
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

  function onSubmit(data: z.infer<typeof CreateSwissTournament>) {
    createSwissTournament.mutate({ ...data, teamId });
  }

  const { data: teamUsers, isLoading } = api.team.getAllMembers.useQuery({
    teamId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!teamUsers) return <MessageBox>No team users found</MessageBox>;

  const contenders = form.watch("participants");

  const setSelected = (newId: string) => {
    if (contenders.includes(newId))
      form.setValue(
        "participants",
        contenders.filter((id) => id !== newId),
      );
    else form.setValue("participants", [...contenders, newId]);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full items-end gap-4 space-y-6 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tournament{"'"}s name</FormLabel>
                <FormControl>
                  <Input placeholder="Tournament's name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roundLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of rounds</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Number of rounds..."
                    {...field}
                    onChange={(event) => {
                      if (event.target.value === "") return field.onChange(1);
                      if (+event.target.value < 1) return field.onChange(1);
                      if (+event.target.value > 100) return field.onChange(100);
                      field.onChange(+event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ShowPickedMembers
            members={teamUsers}
            contenders={contenders}
            setSelected={setSelected}
          />
          <FormField
            control={form.control}
            name="isOpen"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Open for registration
                  </FormLabel>
                  <FormDescription>
                    Users can registrated for the tournament
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={createSwissTournament.isLoading}
            type="submit"
          >
            {createSwissTournament.isLoading ? (
              <LoadingSpinner />
            ) : (
              "Create tournament"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
