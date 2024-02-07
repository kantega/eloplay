"use client";

import { useContext } from "react";
import { LocationContext } from "./LangContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Office, offices } from "@/server/types/officeTypes";
import { setLocalStorageLocation } from "./location";

export function LanguageSelector() {
  const { location, setLocation } = useContext(LocationContext);

  return (
    <Select
      defaultValue={location}
      onValueChange={(v: Office) => {
        setLocation(v);
        setLocalStorageLocation(v);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a office" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Offices</SelectLabel>
          <SelectItem value={offices.All}>All</SelectItem>
          <SelectItem value={offices.Oslo}>Oslo</SelectItem>
          <SelectItem value={offices.Trondheim}>Trondheim</SelectItem>
          <SelectItem value={offices.Bergen}>Bergen</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
