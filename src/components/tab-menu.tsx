import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { type Key } from "react";

export function TabMenu<T extends Key>({
  currentState,
  states,
  setState,
  className,
}: {
  currentState: T;
  states: T[];
  setState: (state: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background-input fixed left-0 top-0 w-full overflow-auto rounded-sm p-2",
        className,
      )}
    >
      <NavigationMenu className="w-fit">
        <NavigationMenuList>
          {states.map((state) => {
            return (
              <NavigationMenuItem key={state}>
                <NavigationMenuLink
                  onClick={() => setState(state)}
                  className={
                    navigationMenuTriggerStyle() +
                    (currentState === state
                      ? " bg-background-tertiary hover:bg-background-tertiary"
                      : "")
                  }
                >
                  {state.toString()}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
