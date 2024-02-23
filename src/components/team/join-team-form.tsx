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
import { teamIdSchema } from "@/server/api/routers/team/team-types";
import LoadingSpinner from "../loading";

export default function JoinTeamForm() {
  const form = useForm<z.infer<typeof teamIdSchema>>({
    resolver: zodResolver(teamIdSchema),
    defaultValues: {
      teamId: "",
    },
  });
  const joinTeamMutation = api.team.join.useMutation({
    onSuccess: async () => {
      form.reset();
      toast({
        title: "Joined team",
        description: "Welcom to the best team in the world!",
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

  function onSubmit(data: z.infer<typeof teamIdSchema>) {
    joinTeamMutation.mutate(data);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-end gap-4 space-y-6 "
        >
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team{"'"}s ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={joinTeamMutation.isLoading} type="submit">
            {joinTeamMutation.isLoading ? <LoadingSpinner /> : "Join team"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
