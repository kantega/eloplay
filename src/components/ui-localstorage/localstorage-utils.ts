import { z } from "zod";

export const getLocalStorageToggleValue = (
  key: string,
  defaultValue = false,
) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return z.boolean().parse(JSON.parse(value));
  }
  return defaultValue;
};

export const setLocalStorageToggleValue = (key: string, value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
