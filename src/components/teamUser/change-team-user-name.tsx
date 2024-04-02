import { api } from "@/utils/api";
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

const ChangeTeamNameType = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    }),
});

export default function ChangeTeamUserName({
  teamId,
  teamUserName,
  setChangeTeamUserName,
}: {
  teamId: string;
  teamUserName: string;
  setChangeTeamUserName: (value: boolean) => void;
}) {
  const form = useForm<z.infer<typeof ChangeTeamNameType>>({
    resolver: zodResolver(ChangeTeamNameType),
    defaultValues: {
      name: teamUserName,
    },
  });

  const ctx = api.useUtils();
  const updateTeamNameMutate = api.teamUser.updateGamerTag.useMutation({
    onSuccess: async () => {
      void ctx.teamUser.get.invalidate({ teamId });
      setChangeTeamUserName(false);

      toast({
        title: "Gamertag updated",
        description: "Your team gamertag has been updated.",
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
    updateTeamNameMutate.mutate({
      gamerTag: data.name,
      teamId,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 "
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
  );
}
