import { useLocalStorage } from "@uidotdev/usehooks";
import { z, type ZodType } from "zod";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLocalGeneric<T extends ZodType<any, any, any>>(
  key: string,
  schema: T,
  initialValue?: z.infer<T>,
) {
  const [value, saveValue] = useLocalStorage(key, initialValue);
  const result = schema.safeParse(value);

  if (result.success)
    return [result.data, saveValue] as [
      z.infer<T>,
      (value: z.infer<T>) => void,
    ];
  return [initialValue, saveValue] as [z.infer<T>, (value: z.infer<T>) => void];
}

export function useLocalBoolean(
  key: string,
  initialValue = false,
): [boolean, (value: boolean) => void] {
  return useLocalGeneric(key, z.boolean(), initialValue);
}
