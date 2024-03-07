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

import { type TeamUser } from "@prisma/client";

export default function PickMembers({
  members,
  selected,
  setSelected,
  children,
}: {
  members: TeamUser[];
  selected: string[];
  setSelected: (selected: string) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sortedMembers = members.sort((a, b) =>
    a.gamerTag.localeCompare(b.gamerTag),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] rounded-sm sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Select members to join tournament
          </DialogTitle>
        </DialogHeader>
        <ul className="h-[50vh] w-full space-y-2 overflow-scroll">
          {sortedMembers.map((teamUser) => {
            const winner = selected.includes(teamUser.userId);
            return (
              <li
                key={teamUser.userId}
                className="flex w-full items-center gap-2 rounded-md bg-background-secondary p-1  "
              >
                <Switch
                  name={"pick-player-" + teamUser.userId}
                  checked={winner}
                  onCheckedChange={() => setSelected(teamUser.userId)}
                />
                <Label
                  htmlFor={"pick-player-" + teamUser.userId}
                  className="flex w-full gap-2 text-xl"
                  onClick={() => setSelected(teamUser.userId)}
                >
                  <User />
                  {teamUser.gamerTag}
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
