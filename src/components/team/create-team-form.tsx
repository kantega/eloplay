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
import { CreateTeam } from "@/server/types/teamTypes";

export default function CreateTeamForm() {
  const form = useForm<z.infer<typeof CreateTeam>>({
    resolver: zodResolver(CreateTeam),
    defaultValues: {
      name: "",
    },
  });
  const createPlayer = api.team.create.useMutation({
    onSuccess: async () => {
      form.reset();
      toast({
        title: "Success",
        description: "Added player.",
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
    createPlayer.mutate(data);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h1 className="w-fit">Create Team</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
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
