"use client";

import React, { createContext, useEffect, useState } from "react";
import { getLocalStorageTeam, setLocalStorageTeam } from "./team-context-util";
import { RoleTexts, type RoleText } from "@/server/types/roleTypes";
import { api } from "@/utils/api";

interface TeamProps {
  teamId: string;
  setTeamId: (id: string) => void;
  role: RoleText;
  setRole: (role: RoleText) => void;
}

const TeamContext = createContext<TeamProps>({
  teamId: getLocalStorageTeam(),
  setTeamId: (id: string) => console.log(id),
  role: RoleTexts.MEMBER,
  setRole: (role: RoleText) => console.log(role),
});

function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teamId, setTeamIdState] = useState<string>(getLocalStorageTeam());
  const { data } = api.team.getRoleByUserId.useQuery({
    id: teamId,
  });

  const [role, setRole] = useState<RoleText>(RoleTexts.MEMBER);

  useEffect(() => {
    setRole(!!data ? data : RoleTexts.MEMBER);
  }, [data]);

  const setTeamId = (id: string) => {
    setTeamIdState(id);
    setLocalStorageTeam(id);
  };

  return (
    <TeamContext.Provider
      value={{
        teamId,
        setTeamId,
        role,
        setRole,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export { TeamContext, TeamProvider };
