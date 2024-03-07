import HeaderLabel from "@/components/header-label";
import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";

export default function BracketTournamentPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <BracketSetup />
    </div>
  );
}

function BracketSetup() {
  const { data, isLoading } = api.teamUser.getAll.useQuery();
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <MessageBox>No team users found</MessageBox>;

  return (
    <>
      <HeaderLabel label="TOURNAMENT" headerText="Bracket tournament" />
      <BracketSetupForm />
    </>
  );
}

function BracketSetupForm() {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="nrRounds">Number of rounds</Label>
      <Input name="nrRounds" type="number" />
      <Button>Open for registration?</Button>
      <Button>Choose participants </Button>
    </div>
  );
}
