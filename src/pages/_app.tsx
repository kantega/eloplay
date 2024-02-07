import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "@/contexts/themeContext/theme-provider";
import Layout from "./layout";
import { LocationProvider } from "@/contexts/locationContext/location-provider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LocationProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
