// db/seed.ts
import {
  Account,
  db,
  eq,
  Product,
  ProductImage,
  Role,
  Session,
  User,
  Verification,
} from "astro:db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { seedProducts } from "./seed-data";

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

  // Guardamos los ids generados por Better Auth
  const createdUsers: { email: string; id: string }[] = [];

  for (const u of users) {
    const result = await authForSeed.api.signUpEmail({
      body: { name: u.name, email: u.email, password: u.password },
    });

    // signUpEmail devuelve el usuario creado con su id
    createdUsers.push({ email: u.email, id: result.user.id });

    await db.update(User).set({ role: u.role }).where(eq(User.email, u.email));
  }

  const adminId = createdUsers[0].id;

  const queries: any = [];

  seedProducts.forEach((p) => {
    const product = {
      id: crypto.randomUUID(),
      description: p.description,
      gender: p.gender,
      price: p.price,
      sizes: p.sizes.join(", "),
      slug: p.slug,
      stock: p.stock,
      tags: p.tags.join(", "),
      title: p.title,
      type: p.type,
      user: adminId,
    };

    queries.push(db.insert(Product).values(product));

    p.images.forEach((img) => {
      const image = {
        id: crypto.randomUUID(),
        productId: product.id,
        image: img,
      };
      queries.push(db.insert(ProductImage).values(image));
    });
  });

  await db.batch(queries);
}
