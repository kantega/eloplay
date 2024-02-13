import { ModeToggle } from "@/contexts/themeContext/theme-toggle";
import { LocationSelector } from "@/contexts/locationContext/location-toggle";
import { signIn, signOut, useSession } from "next-auth/react";
// import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";

export default function NavigationBar() {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-row justify-around bg-background py-2">
      <LocationSelector />

      <span className="flex gap-4">
        <ModeToggle />
        <AuthShowcase />
      </span>
    </div>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  // const { data: secretMessage } = api.player.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined },
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p> */}
      <Button
        variant={sessionData ? "outline" : "default"}
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
