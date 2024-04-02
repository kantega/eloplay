"use client";

import Homepage from "@/components/home-page";
import LoadingSpinner from "@/components/loader/loading";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthProps {
  userId: string;
  userName: string;
}

const AuthContext = createContext<AuthProps>({
  userId: "",
  userName: "",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData) setUserId(sessionData.user.id);
    if (sessionData) setUserName(sessionData.user.name ?? "");
  }, [sessionData]);

  // wait for session to load
  if (status === "loading") return <LoadingSpinner />;
  if (!sessionData && router.pathname !== "/") return void signIn();
  if (!sessionData) return <Homepage />;

  return (
    <AuthContext.Provider
      value={{
        userId,
        userName,
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

export function useUserName() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthData must be used within a AuthProvider");
  }
  return context.userName;
}
