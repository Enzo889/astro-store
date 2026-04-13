import { auth } from "@/lib/auth";
import { ImageUpload } from "@/utils/image-upload";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

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
    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size 5MB")
          .refine(
            (file) => {
              return ACCEPTED_IMAGE_TYPES.includes(file.type);
            },
            `Invalid image type, only ${ACCEPTED_IMAGE_TYPES.join(",")} are allowed`,
          ),
      )
      .optional(),
  }),
  handler: async (form, { request }) => {
    const authSession = await auth.api.getSession(request);
    const user = authSession?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { id = crypto.randomUUID(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = {
      id: id,
      user: user.id!,
      ...rest,
    };

    const queries: any = [];

    if (!form.id) {
      queries.push(db.insert(Product).values(product));
    } else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
    }

    //imagenes con cloudinary
    const secureUrls: string[] = [];

    if (
      form.imageFiles &&
      form.imageFiles.length > 0 &&
      form.imageFiles[0].size > 0
    ) {
      const urls = await Promise.all(
        form.imageFiles.map((file) => ImageUpload.upload(file)),
      );
      secureUrls.push(...urls);
    }

    secureUrls.forEach((imageUrl) => {
      const imageObj = {
        id: crypto.randomUUID(),
        productId: product.id,
        image: imageUrl,
      };
      queries.push(db.insert(ProductImage).values(imageObj));
    });

    await db.batch(queries);

    return product;
  },
});
