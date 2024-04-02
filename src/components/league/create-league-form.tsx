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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import LoadingSpinner from "../loader/loading";
import { CreateLeague } from "@/server/api/routers/league/league-types";
import TeamModerator from "../auhtVisibility/team-moderator";

export default function CreateLeagueForm() {
  const teamId = useTeamId();
  const ctx = api.useUtils();
  const form = useForm<z.infer<typeof CreateLeague>>({
    resolver: zodResolver(CreateLeague),
    defaultValues: {
      name: "",
    },
  });
  const createLeague = api.league.create.useMutation({
    onSuccess: async () => {
      void ctx.league.getAll.invalidate({ teamId });
      form.reset();

      toast({
        title: "Success",
        description: `Added new league to team.`,
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

  function onSubmit(data: z.infer<typeof CreateLeague>) {
    createLeague.mutate({ ...data, teamId });
  }

  return (
    <TeamModerator>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="New league's name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={createLeague.isLoading} type="submit">
            {createLeague.isLoading ? <LoadingSpinner /> : "Create league"}
          </Button>
        </form>
      </Form>
    </TeamModerator>
  );
}
