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
        <meta name="description" content="Generated by create-t3-app" />
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
