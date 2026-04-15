import type { ProductWithImage } from "@/interfaces/get-products-by-page.interface";
import { useState } from "react";

interface Props {
  product: ProductWithImage;
}
export const ProductCard = ({ product }: Props) => {
  const images = product.images.split(",").map((img) => {
    return img.startsWith("http")
      ? img
      : `${import.meta.env.PUBLIC_URL}/images/products/${img}`;
  });

  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <a href={`/products/${product.slug}`}>
      <img
        src={currentImage}
        alt={product.title}
        className="h-[350px] object-contain"
        onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}
        onMouseLeave={() => setCurrentImage(images[0])}
      />
      <h4 className="hover:text-gray-700 transition-colors ">
        {product.title}{" "}
      </h4>
      <p className="text-sm">${product.price} </p>
    </a>
  );
};
