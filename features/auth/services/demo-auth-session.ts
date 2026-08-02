import type {
  DemoAuthSession,
  DemoAuthUser,
} from "../types/demo-auth.types";

export const DEMO_AUTH_SESSION_KEY =
  "kizuna:demo-auth-session:v1";

function isDemoAuthSession(value: unknown): value is DemoAuthSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<DemoAuthSession>;
  return (
    session.version === 1 &&
    typeof session.signedInAt === "string" &&
    Boolean(session.user) &&
    typeof session.user?.id === "string" &&
    typeof session.user?.email === "string" &&
    typeof session.user?.name === "string" &&
    (session.user?.role === "founder" ||
      session.user?.role === "mentor" ||
      session.user?.role === "university-admin")
  );
}

export function readDemoAuthSession(
  storage: Pick<Storage, "getItem">,
): DemoAuthSession | null {
  const serialized = storage.getItem(DEMO_AUTH_SESSION_KEY);
  if (!serialized) return null;
  try {
    const parsed: unknown = JSON.parse(serialized);
    return isDemoAuthSession(parsed)
      ? structuredClone(parsed)
      : null;
  } catch {
    return null;
  }
}

export function writeDemoAuthSession(
  storage: Pick<Storage, "setItem">,
  user: DemoAuthUser,
) {
  const session: DemoAuthSession = {
    version: 1,
    user: structuredClone(user),
    signedInAt: new Date().toISOString(),
  };
  storage.setItem(
    DEMO_AUTH_SESSION_KEY,
    JSON.stringify(session),
  );
  return session;
}

export function clearDemoAuthSession(
  storage: Pick<Storage, "removeItem">,
) {
  storage.removeItem(DEMO_AUTH_SESSION_KEY);
}
