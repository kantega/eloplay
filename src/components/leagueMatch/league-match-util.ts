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

export const getNiceDateString = (date: Date) => {
  return (
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  );
};

export const getNiceDateAndTimeString = (date: Date) => {
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return (
    hours +
    ":" +
    minutes +
    " " +
    date.getDate() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getFullYear()
  );
};
