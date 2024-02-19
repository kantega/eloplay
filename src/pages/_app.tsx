import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "@/contexts/themeContext/theme-provider";
import Layout from "./layout";
import { LocationProvider } from "@/contexts/locationContext/location-provider";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { TeamProvider } from "@/contexts/teamContext/team-provider";
import { LeagueProvider } from "@/contexts/leagueContext/league-provider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TeamProvider>
          <LeagueProvider>
            <LocationProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </LocationProvider>
          </LeagueProvider>
        </TeamProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
