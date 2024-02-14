import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { type RoleText, RoleTexts } from "@/server/types/roleTypes";
import { useContext, useState } from "react";
import { OrganisationContext } from "@/contexts/organisationContext/organisation-provider";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { userIsModerator } from "@/utils/role";
import { toast } from "@/components/ui/use-toast";
import { filterMembers } from "@/utils/match";
import { Input } from "@/components/ui/input";

export default function PlayerPage() {
  const { role, organisationId } = useContext(OrganisationContext);

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl">You are a {role}</h1>
      <OrganisationInfo id={organisationId} />
    </div>
  );
}

function OrganisationInfo({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = api.organisation.findById.useQuery({
    id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Organisation not found</div>;

  const filteredMembers = filterMembers(data.members, searchQuery);

  return (
    <div className="flex flex-col gap-4">
      <h1 className=" text-5xl">{data.organisation.name}</h1>
      <Input
        placeholder="search for opponent..."
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
  const { role, organisationId } = useContext(OrganisationContext);
  const ctx = api.useUtils();
  const { mutateAsync } = api.organisation.setRoleForMember.useMutation({
    onSuccess: async () => {
      await ctx.organisation.findById.invalidate({ id: organisationId });

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
              id: organisationId,
            });
          }}
        >
          {member.role === RoleTexts.MEMBER ? <ArrowBigUp /> : <ArrowBigDown />}
        </Button>
      )}
    </>
  );
}
