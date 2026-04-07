// db/seed.ts
import { Account, db, Role, Session, User, Verification } from "astro:db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const authForSeed = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: User,
      account: Account,
      session: Session,
      verification: Verification,
    },
  }),
  emailAndPassword: { enabled: true },
});

export default async function seed() {
  // 1. Insertar roles
  await db.insert(Role).values([
    { id: "admin", name: "Admin" },
    { id: "user", name: "User" },
    { id: "super-user", name: "Super User" },
  ]);

  // 2. Crear usuarios via Better Auth (genera el hash y la Account correctamente)
  const users = [
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "123456abcDD",
      role: "admin",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      password: "123456abcDD",
      role: "user",
    },
    {
      name: "Mike Johnson",
      email: "mike.johnson@gmail.com",
      password: "123456abcDD",
      role: "super-user",
    },
  ];

  for (const u of users) {
    await authForSeed.api.signUpEmail({
      body: { name: u.name, email: u.email, password: u.password },
    });
  }

  console.log("✅ Seed completado.");
}
