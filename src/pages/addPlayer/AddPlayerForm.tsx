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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { CreatePlayer } from "@/server/types/playerTypes";

export default function AddPlayerForm() {
  const form = useForm<z.infer<typeof CreatePlayer>>({
    resolver: zodResolver(CreatePlayer),
    defaultValues: {
      name: "",
      office: "Oslo",
    },
  });
  const createPlayer = api.player.create.useMutation({
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

  function onSubmit(data: z.infer<typeof CreatePlayer>) {
    createPlayer.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn spillerens navn..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="office"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kontor</FormLabel>
              {/* todo: fix bug where form reset does not visially show */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg kontor..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Oslo">Oslo</SelectItem>
                  <SelectItem value="Trondheim">Trondheim</SelectItem>
                  <SelectItem value="Bergen">Bergen</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* todo: fix bug, you can select a office and press submit at the same time */}
        <Button type="submit">Legg til </Button>
      </form>
    </Form>
  );
}
