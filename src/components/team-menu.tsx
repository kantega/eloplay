import { TabMenu } from "./tab-menu";

export const TeamStates = {
  LEAGUES: "LEAGUES",
  MEMBERS: "MEMBERS",
  BLOCKLIST: "BLOCKLIST",
} as const;

export type TeamState = (typeof TeamStates)[keyof typeof TeamStates];

export function TeamMenu({
  currentState,
  states,
  setState,
  className,
}: {
  currentState: TeamState;
  states: TeamState[];
  setState: (state: TeamState) => void;
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
