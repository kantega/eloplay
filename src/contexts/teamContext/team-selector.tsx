"use client";

import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamContext } from "./team-provider";
import { api } from "@/utils/api";

export function TeamSelector() {
  const [isClient, setIsClient] = useState(false);
  const { teamId, setTeamId } = useContext(TeamContext);
  const { data, isLoading } = api.team.findAll.useQuery();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Select defaultValue={teamId} onValueChange={(v: string) => setTeamId(v)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={isClient ? "Pick team" : ""} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pick a team</SelectLabel>
          {!!data &&
            !isLoading &&
            data.map((team) => {
              return (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}