import { setLocalStorageShowInactivePlayers } from "./league-match-util";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function ShowInactivePlayersToggle({
  showInactivePlayers,
  setShowInactivePlayers,
}: {
  showInactivePlayers: boolean;
  setShowInactivePlayers: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="show-inactive-players"
        checked={showInactivePlayers}
        onCheckedChange={(value: boolean) => {
          setShowInactivePlayers(value);
          setLocalStorageShowInactivePlayers(value);
        }}
      />
      <Label htmlFor="show-inactive-players">Show inactive players</Label>
    </div>
  );
}
