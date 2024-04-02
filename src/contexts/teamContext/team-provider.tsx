"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getLocalStorageTeam, setLocalStorageTeam } from "./team-context-util";
import { RoleTexts, type RoleText } from "@/server/types/roleTypes";
import { api } from "@/utils/api";
import { LeagueContext } from "../leagueContext/league-provider";
import { useRouter } from "next/router";
import FullPageLoader from "@/components/loader/FullPageLoader";

interface TeamProps {
  teamId: string;
  setTeamId: (id: string) => void;
  role: RoleText;
  setRole: (role: RoleText) => void;
}

export const TeamContext = createContext<TeamProps>({
  teamId: getLocalStorageTeam(),
  setTeamId: (id: string) => console.log(id),
  role: RoleTexts.MEMBER,
  setRole: (role: RoleText) => console.log(role),
});

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teamId, setTeamIdState] = useState<string>(getLocalStorageTeam());
  const [role, setRole] = useState<RoleText>(RoleTexts.NOTMEMBER);

  const { data } = api.team.getRoleByUserId.useQuery({
    id: teamId,
  });

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
      <InnerWrapper>{children}</InnerWrapper>
    </TeamContext.Provider>
  );
}

export function InnerWrapper({ children }: { children: React.ReactNode }) {
  const { teamId, setTeamId } = useContext(TeamContext);
  const { setLeagueId } = useContext(LeagueContext);
  const router = useRouter();
  const { data, isLoading } = api.team.getAll.useQuery();

  if (isLoading) return <FullPageLoader />;

  console.log("teamId", teamId);
  console.log("data", data);

  // you have no team selected, but there are teams, select the first team
  if (teamId === "" && !isLoading && !!data && data.length !== 0 && !!data[0])
    setTeamId(data[0].id);

  // theres no teams, reset teamId and leagueId
  if (!isLoading && !!data && data.length === 0 && teamId !== "") {
    setTeamId("");
    setLeagueId("");
  }

  if (teamId !== "" && router.pathname === "/") {
    void router.push("/leaderboard");
    return <FullPageLoader />;
  }

  const noTeamInDbOrContext = teamId === "" && !!data && data.length === 0;
  const notTryingToJoinTeam = router.pathname !== "/team/join/[id]";
  const tryingToReachTeamPages = router.pathname !== "/";

  if (noTeamInDbOrContext && notTryingToJoinTeam && tryingToReachTeamPages) {
    void router.push("/");
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context;
}

export function useTeamId() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.teamId;
}

export function useSetTeamId() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.setTeamId;
}

export function useTeamRole() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.role;
}

export function useSetTeamRole() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.setRole;
}
