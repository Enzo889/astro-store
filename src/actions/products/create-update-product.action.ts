import { auth } from "@/lib/auth";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { db, eq, Product } from "astro:db";
import { getSession } from "better-auth/api";
import { AstroBuilder } from "node_modules/astro/dist/core/build";

export const createUpdateProduct = defineAction({
    accept: "form",
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),

        //TODO: images
        
        
    }),
    handler: async (form, {request}) => {
        const authSession = await auth.api.getSession(request);
        const user = authSession?.user;

        if(!user) {
            throw new Error("Unauthorized")
        }

        const {id = crypto.randomUUID(), ...rest } = form;
        rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

        const product = {
            id: id,
            user: user.id!,
            ...rest,
        }

        console.log({product})
        await db.update(Product).set(product).where(eq(Product.id, id))

        return product
    }
})