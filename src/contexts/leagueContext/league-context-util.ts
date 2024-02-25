"use client";

const localStorageKey = "leagueId";
const defaultValue = "";

export const getLocalStorageLeague = (teamId: string) => {
  if (typeof window !== "undefined") {
    const leagueId = localStorage.getItem(teamId + localStorageKey);
    if (!leagueId) return defaultValue;
    return leagueId;
  }
  return defaultValue;
};

export const getLocalStorageLeagueLast = () => {
  if (typeof window !== "undefined") {
    const leagueId = localStorage.getItem(localStorageKey);
    if (!leagueId) return defaultValue;
    return leagueId;
  }
  return defaultValue;
};

export const setLocalStorageLeague = (location: string, teamId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(teamId + localStorageKey, location);
  }
  setLocalStorageLeagueLast(location);
};

export const setLocalStorageLeagueLast = (location: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, location);
  }
};
