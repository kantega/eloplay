"use client";

import { type Office } from "@/server/types/officeTypes";

export const getLocalStorageLocation = () => {
  if (typeof window !== "undefined") {
    const location = localStorage.getItem("tableTennisLocation");
    if (!location) return "All";
    return location as Office;
  }
  return "All";
};

export const setLocalStorageLocation = (location: Office) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("tableTennisLocation", location);
  }
};
