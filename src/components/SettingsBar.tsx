import { ModeToggle } from "@/contexts/themeContext/theme-toggle";
import { LocationSelector } from "@/contexts/locationContext/location-toggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function NavigationBar() {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-row justify-around bg-background py-2">
      <LocationSelector />

      <span className="flex gap-4">
        <ModeToggle />
        <SignInOrOut />
      </span>
    </div>
  );
}

function SignInOrOut() {
  const { data: sessionData } = useSession();

  return (
    <Button
      variant={sessionData ? "outline" : "default"}
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </Button>
  );
}
