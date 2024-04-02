"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getLocalStorageLeague,
  getLocalStorageLeagueLast,
  setLocalStorageLeague,
} from "./league-context-util";
import { RoleTexts, type RoleText } from "@/server/types/roleTypes";
import { api } from "@/utils/api";
import { useTeamId } from "../teamContext/team-provider";

interface LeagueProps {
  leagueId: string;
  setLeagueId: (id: string) => void;
  role: RoleText;
  setRole: (role: RoleText) => void;
}

const LeagueContext = createContext<LeagueProps>({
  leagueId: getLocalStorageLeagueLast(),
  setLeagueId: (id: string) => console.log(id),
  role: RoleTexts.MEMBER,
  setRole: (role: RoleText) => console.log(role),
});

function LeagueProvider({ children }: { children: React.ReactNode }) {
  const teamId = useTeamId();
  const [leagueId, setLeagueIdState] = useState<string>(
    getLocalStorageLeague(teamId),
  );
  const { data: roleData } = api.team.getRoleByUserId.useQuery({
    id: teamId,
  });

  const { data, isLoading } = api.league.getAll.useQuery({ teamId });

  const [role, setRole] = useState<RoleText>(RoleTexts.MEMBER);

  useEffect(() => {
    setRole(!!roleData ? roleData : RoleTexts.MEMBER);
  }, [roleData]);

  useEffect(() => {
    setLeagueIdState(getLocalStorageLeague(teamId));
  }, [teamId]);

  const setLeagueId = (id: string) => {
    setLeagueIdState(id);
    setLocalStorageLeague(id, teamId);
  };

  // you have no league selected, but there are leagues, select the first league
  if (
    leagueId === "" &&
    !isLoading &&
    !!data &&
    data.length !== 0 &&
    !!data[0]
  ) {
    setLeagueId(data[0].id);
  }

  if (leagueId === "" || teamId === "") return null;

  return (
    <LeagueContext.Provider
      value={{
        leagueId: leagueId,
        setLeagueId,
        role,
        setRole,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
}

export { LeagueContext, LeagueProvider };

export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context;
}

export function useLeagueId() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.leagueId;
}

export function useSetLeagueId() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.setLeagueId;
}

export function useLeagueRole() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.role;
}

export function useSetLeagueRole() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.setRole;
}
