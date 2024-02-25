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
import { LeagueContext } from "./league-provider";
import { api } from "@/utils/api";
import { TeamContext } from "../teamContext/team-provider";

export function LeagueSelector() {
  const { teamId } = useContext(TeamContext);
  const { setLeagueId } = useContext(LeagueContext);

  useEffect(() => {
    if (teamId === "") setLeagueId("");
  }, [setLeagueId, teamId]);

  if (!teamId || teamId === "") return null;

  return <InnerLeagueSelector />;
}

export function InnerLeagueSelector() {
  const [isClient, setIsClient] = useState(false);
  const { teamId } = useContext(TeamContext);
  const { leagueId, setLeagueId } = useContext(LeagueContext);
  const { data, isLoading } = api.league.getAll.useQuery({ teamId });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!!data && data.length > 0 && leagueId === "") {
      setLeagueId(!!data[0] ? data[0].id : "");
    }
  }, [data, leagueId, setLeagueId]);

  if (!isClient) return null;

  return (
    <Select value={leagueId} onValueChange={(v: string) => setLeagueId(v)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={isClient ? "Pick league" : ""} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pick a league</SelectLabel>
          {!!data &&
            !isLoading &&
            data.map((league) => {
              return (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
