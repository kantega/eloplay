import Head from "next/head";
import NavigationBar from "../components/navigation-bar";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Eloplay</title>
        <meta
          name="description"
          content="Eloplay is an app for friendly elo rated competition. Make a team and a league and send an invite link to your friends to start using the app. Your friends only need to click the link and sign in to join the team and league. Additional features include leaderboards, user profiles, recent match history, tournaments and more."
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Toaster />
      <main
        className={`relative m-auto flex min-h-screen max-w-[700px] flex-col items-center bg-background ${inter.variable} pt-2 font-inter`}
      >
        {children}
        <NavigationBar />
      </main>
    </>
  );
}
