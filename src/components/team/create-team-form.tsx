"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { CreateTeam } from "@/server/api/routers/team/team-types";
import LoadingSpinner from "../loading";
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { LeagueContext } from "@/contexts/leagueContext/league-provider";
import { useRouter } from "next/router";

export default function CreateTeamForm() {
  const { setTeamId } = useContext(TeamContext);
  const { setLeagueId } = useContext(LeagueContext);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateTeam>>({
    resolver: zodResolver(CreateTeam),
    defaultValues: {
      name: "",
      leagueName: "",
    },
  });
  const createTeam = api.team.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Success",
        description: `Team ${form.getValues("name")} created.`,
        variant: "success",
      });

      setTeamId(data.team.id);
      setLeagueId(data.league.id);

      void router.push("/leaderboard").then(() => router.reload());
      form.reset();
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

  function onSubmit(data: z.infer<typeof CreateTeam>) {
    createTeam.mutate(data);
  }

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
                <FormLabel>Team{"'"}s name</FormLabel>
                <FormControl>
                  <Input placeholder="Team's name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leagueName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your teams first new league{"'"}s name</FormLabel>
                <FormControl>
                  <Input placeholder="League's name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={createTeam.isLoading}
            type="submit"
          >
            {createTeam.isLoading ? <LoadingSpinner /> : "Create team"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
