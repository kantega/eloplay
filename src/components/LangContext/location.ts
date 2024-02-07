"use client";

import { type Office } from "@/server/types/officeTypes";

export const getLocalStorageLocation = () => {
  console.log("getLocalStorageLocation");
  console.log("typeof window", typeof window);
  if (typeof window !== "undefined") {
    console.log(
      "localStorage.getItem('tableTennisLocation')",
      localStorage.getItem("tableTennisLocation"),
    );
    const location = localStorage.getItem("tableTennisLocation");
    if (!location) return "All";
    return location as Office;
  }
  return "All";
};

export const setLocalStorageLocation = (location: Office) => {
  console.log("setLocalStorageLocation");
  if (typeof window !== "undefined") {
    localStorage.setItem("tableTennisLocation", location);
  }
};
