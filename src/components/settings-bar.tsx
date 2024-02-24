import { ModeToggle } from "@/contexts/themeContext/theme-toggle";
import { AccountDropdown } from "./account-dropdown";
import { LeagueSelector } from "@/contexts/leagueContext/league-selector";

export default function NavigationBar() {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-row justify-between bg-background px-1 py-2">
      <span>
        <LeagueSelector />
      </span>

      <span className="flex gap-4">
        <ModeToggle />
        <AccountDropdown />
      </span>
    </div>
  );
}
