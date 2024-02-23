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
import { useContext } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { userIsModerator } from "@/utils/role";

export default function CreateLeagueForm() {
  const { role, teamId } = useContext(TeamContext);
  const ctx = api.useUtils();
  const form = useForm<z.infer<typeof CreateTeam>>({
    resolver: zodResolver(CreateTeam),
    defaultValues: {
      name: "",
    },
  });
  const createLeague = api.league.create.useMutation({
    onSuccess: async () => {
      void ctx.league.findAll.invalidate({ teamId: teamId });
      form.reset();

      toast({
        title: "Success",
        description: `Added new league, ${form.getValues("name")}, to team.`,
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

  function onSubmit(data: z.infer<typeof CreateTeam>) {
    createLeague.mutate({ ...data, teamId: teamId });
  }

  if (!userIsModerator(role)) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>League{"'"}s name</FormLabel>
              <FormControl>
                <Input placeholder="Navn..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create league </Button>
      </form>
    </Form>
  );
}
