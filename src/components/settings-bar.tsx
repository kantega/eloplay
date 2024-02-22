import { ModeToggle } from "@/contexts/themeContext/theme-toggle";
import { AccountDropdown } from "./account-dropdown";
import { LeagueSelector } from "@/contexts/leagueContext/league-selector";

export default function NavigationBar() {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-row justify-around bg-background py-2">
      <LeagueSelector />

      <span className="flex gap-4">
        <ModeToggle />
        <AccountDropdown />
      </span>
    </div>
  );
}
