import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { setLocalStorageToggleValue } from "./localstorage-utils";

export function LocalStorageCheckbox({
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
      <Checkbox
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
