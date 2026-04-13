import { loginUser, logout, registerUser } from "./auth";
import { loadProductsFromCart } from "./cart/load-products-from-cart.action";
import {
  getProductsByPage,
  getProductBySlug,
  createUpdateProduct,
  deleteProductImage,
} from "./products/";

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPage,
  getProductBySlug,

  //cart
  loadProductsFromCart,

  //admin
  //products
  createUpdateProduct,
  deleteProductImage,
};
