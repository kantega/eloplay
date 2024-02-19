"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getLocalStorageLeague,
  setLocalStorageLeague,
} from "./league-context-util";
import { RoleTexts, type RoleText } from "@/server/types/roleTypes";
import { api } from "@/utils/api";
import { TeamContext } from "../teamContext/team-provider";

interface LeagueProps {
  leagueId: string;
  setLeagueId: (id: string) => void;
  role: RoleText;
  setRole: (role: RoleText) => void;
}

const LeagueContext = createContext<LeagueProps>({
  leagueId: getLocalStorageLeague(),
  setLeagueId: (id: string) => console.log(id),
  role: RoleTexts.MEMBER,
  setRole: (role: RoleText) => console.log(role),
});

function LeagueProvider({ children }: { children: React.ReactNode }) {
  const { teamId } = useContext(TeamContext);
  const [leagueId, setLeagueIdState] = useState<string>(
    getLocalStorageLeague(),
  );
  const { data } = api.team.getRoleByUserId.useQuery({
    id: teamId,
  });

  const [role, setRole] = useState<RoleText>(RoleTexts.MEMBER);

  useEffect(() => {
    setRole(!!data ? data : RoleTexts.MEMBER);
  }, [data]);

  const setLeagueId = (id: string) => {
    setLeagueIdState(id);
    setLocalStorageLeague(id);
  };

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
