import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useTeamId, useTeamRole } from "@/contexts/teamContext/team-provider";
import { Input } from "../ui/input";
import { RoleTexts } from "@/server/types/roleTypes";
import { Check, X } from "lucide-react";
import LoadingSpinner from "../loading";

export const UpdateElo = z.object({
  elo: z.number().min(1).max(9999),
});

export default function UpdateEloLeagueUserForm({
  value,
  setEdit,
  leagueUserId,
}: {
  value: number;
  setEdit: (value: boolean) => void;
  leagueUserId: string;
}) {
  const teamId = useTeamId();
  const role = useTeamRole();
  const ctx = api.useUtils();

  const form = useForm<z.infer<typeof UpdateElo>>({
    resolver: zodResolver(UpdateElo),
    defaultValues: {
      elo: value,
    },
  });
  const updateEloForLeagueUser = api.leagueUser.updateElo.useMutation({
    onSuccess: async () => {
      form.reset();
      setEdit(false);
      void ctx.leagueUser.getAllByLeagueId.invalidate();
      toast({
        title: "League User ELO updated",
        description: "Nice, you updated the ELO for the league user.",
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

  function onSubmit(data: z.infer<typeof UpdateElo>) {
    updateEloForLeagueUser.mutate({ teamId, leagueUserId, elo: data.elo });
  }

  if (role !== RoleTexts.ADMIN) return null;

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-center gap-2 "
        >
          <FormField
            control={form.control}
            name="elo"
            render={({ field }) => (
              <FormItem className="w-16">
                <FormControl>
                  <Input
                    placeholder="ELO"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" className=" aspect-square h-6 w-6">
            <Check size={16} />
          </Button>
        </form>
      </Form>
      <Button
        disabled={updateEloForLeagueUser.isLoading}
        className=" aspect-square h-6 w-6"
        variant={"destructive"}
        size="icon"
        onClick={() => setEdit(false)}
      >
        {updateEloForLeagueUser.isLoading ? (
          <LoadingSpinner />
        ) : (
          <X size={16} />
        )}
      </Button>
    </div>
  );
}
