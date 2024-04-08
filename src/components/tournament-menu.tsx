import { TabMenu } from "./tab-menu";

export const States = {
  MATCHES: "MATCHES",
  INFORMATION: "INFORMATION",
  LEADERBOARD: "LEADERBOARD",
} as const;

export type State = (typeof States)[keyof typeof States];

export function TournamentMenu({
  currentState,
  states,
  setState,
  className,
}: {
  currentState: State;
  states: State[];
  setState: (state: State) => void;
  className?: string;
}) {
  return (
    <TabMenu
      currentState={currentState}
      states={states}
      setState={setState}
      className={className}
    />
  );
}
