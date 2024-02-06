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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AddMatchForm() {
  const players = api.player.findAll.useQuery();
  const form = useForm<z.infer<typeof CreateMatch>>({
    resolver: zodResolver(CreateMatch),
    defaultValues: {
      player1Id: "",
      player2Id: "",
      winner: "",
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
        className="flex h-full w-full flex-col justify-center gap-20 space-y-6"
      >
        <div className="flex flex-col gap-6">
          <div className=" flex flex-row justify-around">
            <FormField
              control={form.control}
              name="player1Id"
              render={({ field }) => (
                <FormItem className="w-[45%]">
                  <FormLabel>Spiller 1</FormLabel>
                  {/* todo: fix bug where form reset does not visially show */}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Spiller 1" />
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
                <FormItem className="w-[45%]">
                  <FormLabel>Spiller 2</FormLabel>
                  {/* todo: fix bug where form reset does not visially show */}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Spiller 2" />
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
          </div>
          <FormField
            control={form.control}
            name="winner"
            render={({ field }) => (
              <FormItem className="m-auto w-[90%] space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row justify-between space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="player111" />
                      </FormControl>
                      <FormLabel className="font-normal">Seier P1</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="player222" />
                      </FormControl>
                      <FormLabel className="font-normal">Seier P2</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* todo: fix bug, you can select a office and press submit at the same time */}
        <Button type="submit" className=" m-auto w-fit">
          Legg til kamp
        </Button>
      </form>
    </Form>
  );
}
