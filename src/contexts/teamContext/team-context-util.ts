"use client";

const localStorageKey = "teamId";
const defaultValue = "";

export const getLocalStorageTeam = () => {
  if (typeof window !== "undefined") {
    const teamId = localStorage.getItem(localStorageKey);
    if (!teamId) return defaultValue;
    return teamId;
  }
  return defaultValue;
};

export const setLocalStorageTeam = (teamId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, teamId);
  }
};
