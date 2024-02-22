import {
  GitBranchPlus,
  LogOut,
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
import { signIn, signOut, useSession } from "next-auth/react";
import { TeamSelector } from "@/contexts/teamContext/team-selector";
import Link from "next/link";
import { useContext, useState } from "react";
import { TeamContext } from "@/contexts/teamContext/team-provider";
import { toast } from "./ui/use-toast";
import { api } from "@/utils/api";

export function AccountDropdown() {
  const [isOpened, setIsOpened] = useState(false);
  const { teamId } = useContext(TeamContext);
  const { data: sessionData } = useSession();

  if (!sessionData) return <SignInOrOutButton />;

  return (
    <DropdownMenu open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className=" bg-background-tertiary">
          <ProfileButton />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <TeamSelector />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
            <Link href="/new/teamUser" className="flex">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
            <Link href="/new/team" className="flex">
              <Users className="mr-2 h-4 w-4" />
              Team Page
            </Link>
          </DropdownMenuItem>
          {teamId !== "" && (
            <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
              <Button
                onClick={() => {
                  const url = `${window.origin}/new/team/join/${teamId}`;
                  void navigator.clipboard.writeText(url).then(() => {
                    toast({
                      title: "Copied invite link to clipboard.",
                      description:
                        "You can now share the link with your friends.",
                      variant: "success",
                    });
                  });
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Copy Invite link
              </Button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
            <Plus className="mr-2 h-4 w-4" />
            <Link href="/new/team/join">Join Team</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpened(!isOpened)}>
            <Plus className="mr-2 h-4 w-4" />
            <Link href="/new/team/create">Create Team</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
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
          <SignInOrOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileButton() {
  const { teamId } = useContext(TeamContext);

  if (teamId === "") return <UserProfileButton />;
  return <TeamUserProfileButton />;
}

function TeamUserProfileButton() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.teamUser.get.useQuery({ id: teamId });

  if (isLoading || !data) return null;

  return (
    <>
      <User className="mr-2 h-6 w-6" /> {data.gamerTag}
    </>
  );
}

function UserProfileButton() {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  return (
    <>
      <User className="mr-2 h-6 w-6" /> {sessionData.user.name}
    </>
  );
}

export function SignInOrOutButton() {
  const { data: sessionData } = useSession();

  return (
    <Button
      className="m-0 p-2"
      variant={sessionData ? "ghost" : "default"}
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {sessionData ? "Sign out" : "Sign in"}
    </Button>
  );
}

export function LogOutButton() {
  return (
    <Button className="m-0 p-0" variant="default" onClick={() => void signIn()}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign in
    </Button>
  );
}

export function LogInButton() {
  return (
    <Button className="m-0 p-0" variant="ghost" onClick={() => void signOut()}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
