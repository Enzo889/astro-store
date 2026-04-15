import { itemsInCart } from "@/store/cart.store.";
import { useEffect } from "react";
import { CartCookiesClient } from "@/utils";
import { useStore } from "@nanostores/react";

export const CartCounter = () => {
  const $itemsInCart = useStore(itemsInCart);

  useEffect(() => {
    const Cart = CartCookiesClient.getCart();
    itemsInCart.set(Cart.length);
  }, []);

  return (
    <a
      href="/cart"
      className="group relative inline-flex items-center justify-center p-1 text-gray-700 transition-all duration-300 hover:text-gray-900 hover:-translate-y-0.5"
    >
      {$itemsInCart > 0 && (
        <span className="absolute -top-1 -right-1 flex justify-center items-center bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 shadow-sm transition-transform duration-300 group-hover:scale-110">
          {$itemsInCart}
        </span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="transition-transform duration-300 group-hover:drop-shadow-md"
      >
        <path
          fill="currentColor"
          d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"
        ></path>
      </svg>
    </a>
  );
};
