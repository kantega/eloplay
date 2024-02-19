"use client";

const localStorageKey = "leagueId";
const defaultValue = "";

export const getLocalStorageLeague = () => {
  if (typeof window !== "undefined") {
    const leagueId = localStorage.getItem(localStorageKey);
    if (!leagueId) return defaultValue;
    return leagueId;
  }
  return defaultValue;
};

export const setLocalStorageLeague = (location: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, location);
  }
};
