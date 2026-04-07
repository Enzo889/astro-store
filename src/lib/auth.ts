// src/lib/auth.ts
import { db, Account, Session, User, Verification } from "astro:db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: import.meta.env.BETTER_AUTH_URL ?? "http://localhost:4321",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: User,
      session: Session,
      account: Account,
      verification: Verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});
