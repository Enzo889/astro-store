import { auth } from "@/lib/auth";
import { ImageUpload } from "@/utils/image-upload";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { db, eq, ProductImage } from "astro:db";

export const deleteProductImage = defineAction({
  accept: "json",
  input: z.string(),
  handler: async (imageId, { request }) => {
    const authSession = await auth.api.getSession(request);
    const user = authSession?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }
    const [productImage] = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.id, imageId));

    if (!productImage) {
      throw new Error(`image with id ${imageId} not found`);
    }

    const deleted = await db
      .delete(ProductImage)
      .where(eq(ProductImage.id, imageId));

    if (productImage.image.includes("http")) {
      await ImageUpload.delete(productImage.image);
    }
    return { ok: true };
  },
});
