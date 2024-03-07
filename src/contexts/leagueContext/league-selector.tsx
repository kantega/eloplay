"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeagueId, useSetLeagueId } from "./league-provider";
import { api } from "@/utils/api";
import { useTeamId } from "../teamContext/team-provider";
import { type League } from "@prisma/client";

export function LeagueSelector() {
  const teamId = useTeamId();
  const setLeagueId = useSetLeagueId();

  useEffect(() => {
    if (teamId === "") setLeagueId("");
  }, [setLeagueId, teamId]);

  if (!teamId || teamId === "") return null;

  return <InnerLeagueSelector />;
}

export function InnerLeagueSelector() {
  const [isClient, setIsClient] = useState(false);
  const [sortedData, setSortedData] = useState<League[]>([]);
  const teamId = useTeamId();
  const leagueId = useLeagueId();
  const setLeagueId = useSetLeagueId();
  const { data, isLoading } = api.league.getAll.useQuery({ teamId });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useMemo(() => {
    if (!data) return;
    setSortedData(data?.sort((a, b) => a.name.localeCompare(b.name)));
  }, [data]);

  useEffect(() => {
    if (
      sortedData.length > 0 &&
      sortedData.find((league) => league.id === leagueId) === undefined
    ) {
      setLeagueId(!!sortedData[0] ? sortedData[0].id : "");
    }
  }, [sortedData, leagueId, setLeagueId]);

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
