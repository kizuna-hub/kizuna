import assert from "node:assert/strict";
import test from "node:test";

import {
  authenticateDemoUser,
  createMockAuthRepository,
  DEMO_PASSWORD,
  DemoAuthError,
  getRoleLandingPath,
} from "../services/demo-auth-repository";
import {
  clearDemoAuthSession,
  readDemoAuthSession,
  writeDemoAuthSession,
} from "../services/demo-auth-session";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}

test("exact demo accounts authenticate and route by role", () => {
  const founder = authenticateDemoUser({
    email: "founder@demo.kizuna.vn",
    password: DEMO_PASSWORD,
    role: "founder",
  });
  const mentor = authenticateDemoUser({
    email: "mentor@demo.kizuna.vn",
    password: DEMO_PASSWORD,
    role: "mentor",
  });
  const universityAdmin = authenticateDemoUser({
    email: "admin@demo.kizuna.vn",
    password: DEMO_PASSWORD,
    role: "university-admin",
  });

  assert.equal(founder.name, "Nguyễn Tuấn Ngọc");
  assert.equal(
    getRoleLandingPath(founder.role),
    "/founder/projects",
  );
  assert.equal(mentor.name, "Trần Minh Quân");
  assert.equal(
    getRoleLandingPath(mentor.role),
    "/mentor/dashboard/requests",
  );
  assert.equal(
    getRoleLandingPath(universityAdmin.role),
    "/university-admin",
  );
});

test("invalid credentials and role mismatch are rejected", () => {
  assert.throws(
    () =>
      authenticateDemoUser({
        email: "",
        password: "",
      }),
    /nhập email/i,
  );
  assert.throws(
    () =>
      authenticateDemoUser({
        email: "founder@demo.kizuna.vn",
        password: "wrong",
      }),
    DemoAuthError,
  );
  assert.throws(
    () =>
      authenticateDemoUser({
        email: "mentor@demo.kizuna.vn",
        password: DEMO_PASSWORD,
        role: "founder",
      }),
    /vai trò/i,
  );
});

test("session round-trips in tab-scoped storage and clears", () => {
  const storage = createStorage();
  const user = authenticateDemoUser({
    email: "founder@demo.kizuna.vn",
    password: DEMO_PASSWORD,
  });
  writeDemoAuthSession(storage, user);
  assert.equal(readDemoAuthSession(storage)?.user.id, user.id);
  clearDemoAuthSession(storage);
  assert.equal(readDemoAuthSession(storage), null);
});

test("MockAuthRepository owns session lifecycle outside React", async () => {
  const storage = createStorage();
  const repository = createMockAuthRepository(
    () => storage as Storage,
  );
  const session = await repository.signIn({
    email: "mentor@demo.kizuna.vn",
    password: DEMO_PASSWORD,
    role: "mentor",
  });

  assert.equal(session.user.role, "mentor");
  assert.equal(
    (await repository.getCurrentUser())?.name,
    "Trần Minh Quân",
  );
  await repository.signOut();
  assert.equal(await repository.getSession(), null);
});
