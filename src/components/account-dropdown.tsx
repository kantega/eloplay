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
import { OrganisationSelector } from "@/contexts/organisationContext/organisation-toggle";
import Link from "next/link";
import { useContext } from "react";
import { OrganisationContext } from "@/contexts/organisationContext/organisation-provider";
import { userIsModerator } from "@/utils/role";
import { toast } from "./ui/use-toast";

export function AccountDropdown() {
  const { role, organisationId } = useContext(OrganisationContext);
  const { data: sessionData } = useSession();

  if (!sessionData) return <SignInOrOutButton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User className="mr-2 h-6 w-6" /> {sessionData.user.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <OrganisationSelector />
          </DropdownMenuItem>
          {userIsModerator(role) && (
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <Link href="/new/organisation">Team Admin Page</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Button
              onClick={() => {
                const url = `${window.origin}/new/organisation/join/${organisationId}`;
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
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <Link href="/new/organisation/join">Join Team</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <Link href="/new/organisation/create">Create Team</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <GitBranchPlus className="mr-2 h-4 w-4" />
          <span>
            <a href="https://github.com/kantega/tableTennisLeaderboard">
              Want to contribute?
            </a>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignInOrOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SignInOrOutButton() {
  const { data: sessionData } = useSession();

  return (
    <Button
      className="m-0 p-0"
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
