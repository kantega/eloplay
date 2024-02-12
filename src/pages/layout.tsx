import { ModeToggle } from "@/contexts/themeContext/theme-toggle";
import Head from "next/head";
import NavigationBar from "../components/NavigationBar";
import { Toaster } from "@/components/ui/toaster";
import { LocationSelector } from "@/contexts/locationContext/location-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Eloplay</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/table_tennis.png" />
      </Head>
      <main className="relative m-auto flex min-h-screen max-w-[700px] flex-col items-center bg-background pt-24">
        <Toaster />
        <div className=" absolute left-4 top-4">
          <LocationSelector />
        </div>
        <div className=" absolute right-4 top-4">
          <ModeToggle />
        </div>
        {children}
        <NavigationBar />
      </main>
    </>
  );
}
