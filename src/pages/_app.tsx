import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./layout";
import { LocationProvider } from "@/components/LangContext/LangContext";

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
