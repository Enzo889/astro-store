import { loginUser, logout, registerUser } from "./auth";
import { getProductsByPage, getProductBySlug } from "./products/";

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPage,
  getProductBySlug,
};
