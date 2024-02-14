"use client";

const localStorageKey = "organisationId";
const defaultValue = "";

export const getLocalStorageOrganisation = () => {
  if (typeof window !== "undefined") {
    const organisationId = localStorage.getItem(localStorageKey);
    if (!organisationId) return defaultValue;
    return organisationId;
  }
  return defaultValue;
};

export const setLocalStorageOrganisation = (location: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, location);
  }
};
