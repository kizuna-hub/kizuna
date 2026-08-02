import type {
  DemoAuthSession,
  DemoAuthUser,
  DemoLoginInput,
  DemoRegistrationInput,
} from "../types/demo-auth.types";
import {
  clearDemoAuthSession,
  readDemoAuthSession,
  writeDemoAuthSession,
} from "./demo-auth-session";

export const DEMO_PASSWORD = "KizunaDemo123!";

export const DEMO_AUTH_USERS: readonly DemoAuthUser[] = [
  {
    id: "founder-nguyen-tuan-ngoc",
    email: "founder@demo.kizuna.vn",
    name: "Nguyễn Tuấn Ngọc",
    role: "founder",
  },
  {
    id: "mentor-tran-minh-quan",
    email: "mentor@demo.kizuna.vn",
    name: "Trần Minh Quân",
    role: "mentor",
  },
  {
    id: "university-admin-nguyen-thu-ha",
    email: "admin@demo.kizuna.vn",
    name: "Nguyễn Thu Hà",
    role: "university-admin",
  },
] as const;

export class DemoAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DemoAuthError";
  }
}

export function authenticateDemoUser(
  input: DemoLoginInput,
): DemoAuthUser {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new DemoAuthError("Vui lòng nhập email.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new DemoAuthError("Email chưa đúng định dạng.");
  }
  if (!input.password) {
    throw new DemoAuthError("Vui lòng nhập mật khẩu.");
  }
  const user = DEMO_AUTH_USERS.find(
    (candidate) => candidate.email === normalizedEmail,
  );
  if (!user || input.password !== DEMO_PASSWORD) {
    throw new DemoAuthError(
      "Email hoặc mật khẩu demo không chính xác.",
    );
  }
  if (input.role && user.role !== input.role) {
    throw new DemoAuthError(
      "Tài khoản không thuộc vai trò bạn đã chọn.",
    );
  }
  return structuredClone(user);
}

export function validateDemoRegistration(
  input: DemoRegistrationInput,
) {
  if (!input.name.trim()) {
    throw new DemoAuthError("Vui lòng nhập họ và tên.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    throw new DemoAuthError("Email chưa đúng định dạng.");
  }
  if (input.password !== DEMO_PASSWORD) {
    throw new DemoAuthError(
      `Bản demo dùng mật khẩu ${DEMO_PASSWORD}.`,
    );
  }
  const matchingRole = DEMO_AUTH_USERS.find(
    (candidate) => candidate.role === input.role,
  );
  if (!matchingRole) {
    throw new DemoAuthError("Vai trò demo không hợp lệ.");
  }
  return structuredClone(matchingRole);
}

export function getRoleLandingPath(role: DemoAuthUser["role"]) {
  if (role === "founder") return "/founder/projects";
  if (role === "mentor") return "/mentor/dashboard/requests";
  return "/university-admin";
}

export interface DemoAuthRepository {
  signIn(input: DemoLoginInput): Promise<DemoAuthSession>;
  signUp(
    input: DemoRegistrationInput,
  ): Promise<DemoAuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<DemoAuthSession | null>;
  getCurrentUser(): Promise<DemoAuthUser | null>;
}

export function createMockAuthRepository(
  getStorage: () => Storage,
): DemoAuthRepository {
  return {
    async signIn(input) {
      return writeDemoAuthSession(
        getStorage(),
        authenticateDemoUser(input),
      );
    },
    async signUp(input) {
      return writeDemoAuthSession(
        getStorage(),
        validateDemoRegistration(input),
      );
    },
    async signOut() {
      clearDemoAuthSession(getStorage());
    },
    async getSession() {
      return readDemoAuthSession(getStorage());
    },
    async getCurrentUser() {
      return readDemoAuthSession(getStorage())?.user ?? null;
    },
  };
}
