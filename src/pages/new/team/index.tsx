import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import { useContext, useState } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp, Check, PencilLine, X } from "lucide-react";
import { userIsAdmin, userIsModerator } from "@/utils/role";
import { toast } from "@/components/ui/use-toast";
import { filterMembers } from "@/utils/match";
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

export default function PlayerPage() {
  const { role, teamId } = useContext(TeamContext);

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl">You are a {role}</h1>
      <TeamInfo id={teamId} />
    </div>
  );
}

function TeamInfo({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { role } = useContext(TeamContext);
  const [changeTeamName, setChangeTeamName] = useState(false);
  const { data, isLoading } = api.team.findById.useQuery({
    id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Team not found</div>;

  const filteredMembers = filterMembers(data.members, searchQuery);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        {!changeTeamName && <h1 className=" text-5xl">{data.team.name}</h1>}
        {changeTeamName && (
          <ChangeTeamName
            teamName={data.team.name}
            setChangeTeamName={setChangeTeamName}
          />
        )}
        {userIsAdmin(role) && (
          <Button
            variant={!changeTeamName ? "ghost" : "destructive"}
            size="icon"
            onClick={() => setChangeTeamName(!changeTeamName)}
          >
            {!changeTeamName ? <PencilLine /> : <X />}
          </Button>
        )}
      </div>

      <Input
        placeholder="search for member..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
      />
      <ul className="flex flex-col justify-center gap-1">
        {filteredMembers.map((member) => {
          return (
            <li key={member.id} className=" flex gap-4">
              {member.name}{" "}
              <Badge
                variant={
                  member.role === RoleTexts.MEMBER ? "outline" : "default"
                }
              >
                {member.role}
              </Badge>
              <UpgradeUserButton member={member} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function UpgradeUserButton({
  member,
}: {
  member: { role: RoleText; id: string };
}) {
  const { role, teamId } = useContext(TeamContext);
  const ctx = api.useUtils();
  const { mutateAsync } = api.team.setRoleForMember.useMutation({
    onSuccess: async () => {
      void ctx.team.findById.invalidate({ id: teamId });

      toast({
        title: "Success",
        description: "Member role updated.",
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

  return (
    <>
      {member.role !== RoleTexts.ADMIN && userIsModerator(role) && (
        <Button
          variant="outline"
          size="icon"
          onClick={async () => {
            await mutateAsync({
              userId: member.id,
              newRole:
                member.role === RoleTexts.MEMBER
                  ? RoleTexts.MODERATOR
                  : RoleTexts.MEMBER,
              id: teamId,
            });
          }}
        >
          {member.role === RoleTexts.MEMBER ? <ArrowBigUp /> : <ArrowBigDown />}
        </Button>
      )}
    </>
  );
}

const ChangeTeamNameType = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});

function ChangeTeamName({
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
  const { role, teamId } = useContext(TeamContext);
  const updateTeamNameMutate = api.team.changeTeamName.useMutation({
    onSuccess: async () => {
      void ctx.team.findById.invalidate({ id: teamId });
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
    updateTeamNameMutate.mutate({ name: data.name, id: teamId });
  };

  if (!userIsAdmin(role)) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-2/3 gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Navn..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" className=" aspect-square">
          <Check />
        </Button>
      </form>
    </Form>
  );
}
