import { api } from "@/utils/api";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../loader/loading";
import TeamAdmin from "../auhtVisibility/team-admin";

const ChangeTeamNameType = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});

export default function ChangeTeamName({
  teamName,
  setChangeTeamName,
}: {
  teamName: string;
  setChangeTeamName: (value: boolean) => void;
}) {
  const form = useForm<z.infer<typeof ChangeTeamNameType>>({
    resolver: zodResolver(ChangeTeamNameType),
    defaultValues: {
      name: teamName,
    },
  });

  const ctx = api.useUtils();
  const teamId = useTeamId();
  const updateTeamNameMutate = api.team.updateTeamName.useMutation({
    onSuccess: async () => {
      void ctx.team.getById.invalidate({ teamId });
      setChangeTeamName(false);

      toast({
        title: "Success",
        description: "Team name updated.",
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

  const onSubmit = (data: { name: string }) => {
    updateTeamNameMutate.mutate({ name: data.name, teamId });
  };

  return (
    <TeamAdmin>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-2/3 items-center gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={updateTeamNameMutate.isLoading}
            type="submit"
            size="icon"
            className=" aspect-square h-6 w-6"
          >
            {updateTeamNameMutate.isLoading ? (
              <LoadingSpinner />
            ) : (
              <Check size={16} />
            )}
          </Button>
        </form>
      </Form>
    </TeamAdmin>
  );
}
