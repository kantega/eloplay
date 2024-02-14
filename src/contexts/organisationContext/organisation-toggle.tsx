"use client";

import { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganisationContext } from "./organisation-provider";
import { api } from "@/utils/api";

export function OrganisationSelector() {
  const { organisationId, setOrganisationId } = useContext(OrganisationContext);
  const { data, isLoading } = api.organisation.findAll.useQuery();

  return (
    <Select
      defaultValue={organisationId}
      onValueChange={(v: string) => setOrganisationId(v)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Organisationer</SelectLabel>
          {!!data &&
            !isLoading &&
            data.map((organisation) => (
              <SelectItem key={organisation.id} value={organisation.id}>
                {organisation.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
