"use client";

import * as React from "react";

import {
  createMockAuthRepository,
} from "../services/demo-auth-repository";
import type {
  DemoAuthSession,
  DemoLoginInput,
  DemoRegistrationInput,
} from "../types/demo-auth.types";
import { trackProductEvent } from "@/features/demo-domain/services/product-analytics";

interface DemoAuthContextValue {
  session: DemoAuthSession | null;
  hydrated: boolean;
  login: (input: DemoLoginInput) => Promise<DemoAuthSession>;
  register: (
    input: DemoRegistrationInput,
  ) => Promise<DemoAuthSession>;
  logout: () => Promise<void>;
}

const DemoAuthContext =
  React.createContext<DemoAuthContextValue | null>(null);

export function DemoAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] =
    React.useState<DemoAuthSession | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const repository = React.useMemo(
    () =>
      createMockAuthRepository(() => window.sessionStorage),
    [],
  );

  React.useEffect(() => {
    let active = true;
    void repository.getSession().then((restored) => {
      if (!active) return;
      setSession(restored);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, [repository]);

  const login = React.useCallback(async (input: DemoLoginInput) => {
    const next = await repository.signIn(input);
    setSession(next);
    trackProductEvent(
      next.user.role === "founder"
        ? "demo_founder_logged_in"
        : "demo_mentor_logged_in",
      { userId: next.user.id },
    );
    return next;
  }, [repository]);

  const register = React.useCallback(
    async (input: DemoRegistrationInput) => {
      const next = await repository.signUp(input);
      setSession(next);
      trackProductEvent(
        next.user.role === "founder"
          ? "demo_founder_logged_in"
          : "demo_mentor_logged_in",
        { userId: next.user.id, source: "signup" },
      );
      return next;
    },
    [repository],
  );

  const logout = React.useCallback(async () => {
    await repository.signOut();
    setSession(null);
  }, [repository]);

  const value = React.useMemo<DemoAuthContextValue>(
    () => ({
      session,
      hydrated,
      login,
      register,
      logout,
    }),
    [hydrated, login, logout, register, session],
  );

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = React.useContext(DemoAuthContext);
  if (!context) {
    throw new Error(
      "useDemoAuth must be used within DemoAuthProvider",
    );
  }
  return context;
}
