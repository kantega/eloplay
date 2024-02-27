"use client";

import Homepage from "@/components/home-page";
import LoadingSpinner from "@/components/loading";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthProps {
  userId: string;
}

const AuthContext = createContext<AuthProps>({
  userId: "default",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("");
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData) setUserId(sessionData.user.id);
  }, [sessionData]);

  // wait for session to load
  if (status === "loading") return <LoadingSpinner />;
  if (!sessionData && router.pathname !== "/") return void signIn();
  if (!sessionData) return <Homepage />;

  return (
    <AuthContext.Provider
      value={{
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useUserId() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.userId;
}
