import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { setLocalStorageToggleValue } from "./localstorage-utils";

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
