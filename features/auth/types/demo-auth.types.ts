export type DemoUserRole =
  | "founder"
  | "mentor"
  | "university-admin";

export interface DemoAuthUser {
  id: string;
  email: string;
  name: string;
  role: DemoUserRole;
}

export interface DemoAuthSession {
  version: 1;
  user: DemoAuthUser;
  signedInAt: string;
}

export interface DemoLoginInput {
  email: string;
  password: string;
  role?: DemoUserRole;
}

export interface DemoRegistrationInput {
  name: string;
  email: string;
  password: string;
  role: DemoUserRole;
}
