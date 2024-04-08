import {
  GitBranchPlus,
  LogOut,
  Menu,
  Plus,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut } from "next-auth/react";
import { TeamSelector } from "@/contexts/teamContext/team-selector";
import Link from "next/link";
import { useState } from "react";
import { useTeamId } from "@/contexts/teamContext/team-provider";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/router";
import { LeagueSelector } from "@/contexts/leagueContext/league-selector";
import TeamMember from "./auhtVisibility/team-member";

export function AccountDropdown() {
  const [isOpened, setIsOpened] = useState(false);
  const teamId = useTeamId();
  const router = useRouter();

  return (
    <DropdownMenu open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className=" m-0 flex h-full flex-col items-center justify-center gap-3 text-[10px] hover:bg-transparent"
        >
          <TriggerButton />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => setIsOpened(!isOpened)}
          className="flex justify-between gap-2"
        >
          <Link href="/user" className="flex">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
          {/* <ModeToggle /> */}
          {/* Somehow this is bugged */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <TeamMember>
          <DropdownMenuItem className="flex flex-col items-start gap-2">
            <p>League picker</p>

            <LeagueSelector />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </TeamMember>
        {router.pathname !== "/" && teamId !== "" && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex flex-col items-start gap-2">
                <p>Team picker</p>
                <TeamSelector />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
                <Link href="/team" className="flex">
                  <Users className="mr-2 h-4 w-4" />
                  Team Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
                <Link href="/teamUser" className="flex">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Team Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
                <Button
                  onClick={() => {
                    const url = `${window.origin}/team/join/${teamId}`;
                    void navigator.clipboard.writeText(url).then(() => {
                      toast({
                        title: "Copied invite link to clipboard.",
                        description:
                          "Share the team invite link to connect users to your team.",
                        variant: "success",
                      });
                    });
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Copy Invite link
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
                <Plus className="mr-2 h-4 w-4" />
                <Link href="/team/join">Join Team</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
                <Plus className="mr-2 h-4 w-4" />
                <Link href="/team/create">Create Team</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
          <GitBranchPlus className="mr-2 h-4 w-4" />
          <span>
            <a href="https://github.com/kantega/tableTennisLeaderboard">
              Want to contribute?
            </a>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TriggerButton() {
  return (
    <>
      <Menu className="text-primary" /> More
    </>
  );
}

export function LogInButton() {
  return (
    <Button
      className="m-0 p-2"
      variant="default"
      onClick={() => {
        localStorage.clear();
        void signIn();
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign in
    </Button>
  );
}

export function LogOutButton() {
  const router = useRouter();
  return (
    <Button
      className="m-0 p-2"
      variant="ghost"
      onClick={async () => {
        localStorage.clear();
        await signOut();
        await router.push("/").then(() => router.reload());
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
