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

export default function CreateTeamForm() {
  const form = useForm<z.infer<typeof CreateTeam>>({
    resolver: zodResolver(CreateTeam),
    defaultValues: {
      name: "",
    },
  });
  const createTeam = api.team.create.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: `Team ${form.getValues("name")} created.`,
        variant: "default",
      });
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
          className="flex w-full items-end gap-4 space-y-6 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team{"'"}s name</FormLabel>
                <FormControl>
                  <Input placeholder="Navn..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create team </Button>
        </form>
      </Form>
    </div>
  );
}
