/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

interface Roles {
  id: string;
  name: string;
}

interface UserDB {
  name: string;
  email: string;
  // TODO:
  id: string;
  password: string;
  role: Roles;
  createdAt: Date;
}

declare namespace App {
  interface Locals {
    session: import("better-auth").Session | null;
    user: (import("better-auth").User & { role?: string | null }) | null;
  }
}
