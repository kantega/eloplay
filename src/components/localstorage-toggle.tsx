import { z } from "zod";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function LocalStorageToggle({
  isToggled,
  setIsToggled,
  localStorageKey,
  label,
}: {
  isToggled: boolean;
  setIsToggled: (value: boolean) => void;
  localStorageKey: string;
  label?: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={localStorageKey}
        checked={isToggled}
        onCheckedChange={(value: boolean) => {
          setIsToggled(value);
          setLocalStorageToggleValue(localStorageKey, value);
        }}
      />
      {label !== undefined && <Label htmlFor={localStorageKey}>{label}</Label>}
    </div>
  );
}

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
