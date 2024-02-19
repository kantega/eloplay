import { ModeToggle } from "@/contexts/themeContext/theme-toggle";
import { LocationSelector } from "@/contexts/locationContext/location-toggle";
import { AccountDropdown } from "./account-dropdown";

export default function NavigationBar() {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-row justify-around bg-background py-2">
      <span className="flex gap-4">
        <LocationSelector />
      </span>

      <span className="flex gap-4">
        <ModeToggle />
        <AccountDropdown />
      </span>
    </div>
  );
}
