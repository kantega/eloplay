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
        "fixed bottom-16 left-0 z-50 flex w-full justify-center overflow-auto rounded-sm bg-background-secondary p-2",
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
