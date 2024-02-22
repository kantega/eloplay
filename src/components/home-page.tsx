import { SignInOrOutButton } from "./account-dropdown";
import { TextRevealCard } from "./ui/text-reveal-card";

export default function Homepage() {
  return (
    <div className="relative flex h-screen flex-col items-center pt-16">
      <SignInButtonTopRight />
      <TextRevealCard
        className="h-fit w-fit border-none bg-background text-5xl text-primary"
        text={"KANTEGA PRESENTS"}
        revealText={"  KANTEGA ELOPLAY  "}
      />
    </div>
  );
}

function SignInButtonTopRight() {
  return (
    <div className="absolute right-2 top-2 text-4xl font-bold">
      <SignInOrOutButton />
    </div>
  );
}
