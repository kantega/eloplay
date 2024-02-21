"use client";

import { z } from "zod";

const localStorageKey = "shouldFilterUnplayedPlayers";
const defaultValue = true;

export const getLocalStorageShouldFilterUnplayedPlayers = () => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(localStorageKey);
    if (!value) return defaultValue;
    return z.boolean().parse(defaultValue);
  }
  return defaultValue;
};

// todo: bug cant set value and read value
export const setLocalStorageShouldFilterUnplayedPlayers = (value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }
};
