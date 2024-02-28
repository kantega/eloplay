import HeaderLabel from "@/components/header-label";
import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import PickMembers from "@/components/tournaments/pick-members";
import ShowPickedMembers from "@/components/tournaments/show-picked-members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { useState } from "react";
import { z } from "zod";

export default function NvsNTournamentPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <NvsNSetup />
    </div>
  );
}

function NvsNSetup() {
  return (
    <>
      <HeaderLabel label="TOURNAMENT" headerText="N vs N tournament" />
      <NvsNSetupForm />
    </>
  );
}

function NvsNSetupForm() {
  const [value, setValue] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contenders, setContenders] = useState<string[]>([]);
  const { data, isLoading } = api.teamUser.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <MessageBox>No team users found</MessageBox>;

  const setSelected = (newId: string) => {
    if (contenders.includes(newId))
      setContenders(contenders.filter((id) => id !== newId));
    else setContenders([...contenders, newId]);
  };

  return (
    <div className="flex flex-col gap-4">
      <span>
        <Label htmlFor="tournament-name">Tournament name</Label>
        <Input
          value={name}
          name="tournament-name"
          type="text"
          onChange={(v) => setName(z.string().parse(v.currentTarget.value))}
        />
      </span>
      <Label htmlFor="nrRounds">Number of rounds</Label>
      <Input
        value={value}
        min={0}
        max={100}
        name="nrRounds"
        type="number"
        onChange={(v) => setValue(z.number().parse(+v.currentTarget.value))}
      />
      <div className="flex items-center gap-2">
        <Switch
          id="open-for-registration"
          checked={isOpen}
          onCheckedChange={(v: boolean) => setIsOpen(v)}
        />
        <Label htmlFor="open-for-registration">Open for registration</Label>
      </div>
      <PickMembers
        members={data}
        selected={contenders}
        setSelected={setSelected}
      >
        <Button>Select participants</Button>
      </PickMembers>
      <ShowPickedMembers members={data} contenders={contenders} />
      <Button>Create</Button>
    </div>
  );
}
