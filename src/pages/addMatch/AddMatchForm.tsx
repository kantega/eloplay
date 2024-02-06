"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function AddMatchForm() {
  const players = api.player.findAll.useQuery();
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
            <FormItem className="w-[65%]">
              <FormLabel className="text-2xl text-primary">Vinner</FormLabel>
              {/* todo: fix bug where form reset does not visially show */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Vinner..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players.data?.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {`${player.name} | ${player.office}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="player2Id"
          render={({ field }) => (
            <FormItem className="w-[65%]">
              <FormLabel className="text-2xl text-destructive">Taper</FormLabel>
              {/* todo: fix bug where form reset does not visially show */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Taper..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players.data?.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {`${player.name} | ${player.office}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* todo: fix bug, you can select a office and press submit at the same time */}
        <Button type="submit" className=" m-auto w-fit">
          Legg til kamp
        </Button>
      </form>
    </Form>
  );
}
