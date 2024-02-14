"use client";

import React, { createContext, useEffect, useState } from "react";
import {
  getLocalStorageOrganisation,
  setLocalStorageOrganisation,
} from "./organisation-context-util";
import { RoleTexts, type RoleText } from "@/server/types/roleTypes";
import { api } from "@/utils/api";

interface OrganisationProps {
  organisationId: string;
  setOrganisationId: (id: string) => void;
  role: RoleText;
  setRole: (role: RoleText) => void;
}

const OrganisationContext = createContext<OrganisationProps>({
  organisationId: getLocalStorageOrganisation(),
  setOrganisationId: (id: string) => console.log(id),
  role: RoleTexts.MEMBER,
  setRole: (role: RoleText) => console.log(role),
});

function OrganisationProvider({ children }: { children: React.ReactNode }) {
  const [organisationId, setOrganisationIdState] = useState<string>(
    getLocalStorageOrganisation(),
  );
  const { data } = api.organisation.getRoleByUserId.useQuery({
    id: organisationId,
  });

  const [role, setRole] = useState<RoleText>(RoleTexts.MEMBER);

  useEffect(() => {
    setRole(!!data ? data : RoleTexts.MEMBER);
  }, [data]);

  const setOrganisationId = (id: string) => {
    setOrganisationIdState(id);
    setLocalStorageOrganisation(id);
  };

  return (
    <OrganisationContext.Provider
      value={{
        organisationId: organisationId,
        setOrganisationId,
        role,
        setRole,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
}

export { OrganisationContext, OrganisationProvider };
