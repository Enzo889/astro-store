import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth";

const authPages = ["/login", "/register"];
const privateRoutes = ["/dashboard", "/admin", "/profile"];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {
    const isAuthed = await auth.api.getSession({
      headers: request.headers,
    });
    if (isAuthed) {
      locals.user = isAuthed.user;
      locals.session = isAuthed.session;
    } else {
      locals.user = null;
      locals.session = null;
    }

    if (locals.session && authPages.includes(url.pathname)) {
      return redirect("/");
    }

    if (
      !locals.session &&
      privateRoutes.some((route) => url.pathname.startsWith(route))
    ) {
      return redirect("/login");
    }

    return next();
  },
);
