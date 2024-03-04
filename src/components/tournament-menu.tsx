import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const States = {
  MATCHES: "MATCHES",
  INFORMATION: "INFORMATION",
} as const;

export type State = (typeof States)[keyof typeof States];

export function TournamentMenu({
  currentState,
  states,
  setState,
}: {
  currentState: State;
  states: State[];
  setState: (state: State) => void;
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {states.map((state) => (
          <NavigationMenuItem key={state}>
            <NavigationMenuLink
              onClick={() => setState(state)}
              className={
                navigationMenuTriggerStyle() +
                (currentState === state ? " bg-background-tertiary" : "")
              }
            >
              {state}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
