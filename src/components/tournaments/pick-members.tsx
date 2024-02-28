import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { type TeamUserTeamAndRole } from "../teamUser/team-user-types";

export default function PickMembers({
  members,
  selected,
  setSelected,
  children,
}: {
  members: TeamUserTeamAndRole[];
  selected: string[];
  setSelected: (selected: string) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Select members to join tournament{" "}
          </DialogTitle>
        </DialogHeader>
        <ul className="w-full space-y-2">
          {members.map((teamUser) => {
            const winner = selected.includes(teamUser.teamUser.id);
            return (
              <li
                key={teamUser.teamUser.id}
                className="flex w-full items-center gap-2 rounded-md bg-background-secondary p-1  "
              >
                <Switch
                  name={"pick-player-" + teamUser.teamUser.id}
                  checked={winner}
                  onCheckedChange={() => setSelected(teamUser.teamUser.id)}
                />
                <Label
                  htmlFor={"pick-player-" + teamUser.teamUser.id}
                  className="flex w-full gap-2 text-xl"
                  onClick={() => setSelected(teamUser.teamUser.id)}
                >
                  <User />
                  {teamUser.teamUser.gamerTag}
                </Label>
              </li>
            );
          })}
        </ul>
        <DialogFooter>
          <Button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="w-full"
            type="submit"
            variant="default"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
