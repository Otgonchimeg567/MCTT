import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session cookie on every /admin request and keeps signed-out visitors on the login page.
 * Role checks happen in the pages (lib/auth.ts) and in the database (RLS).
 */
export async function middleware(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return new NextResponse("Supabase is not configured.", { status: 503 });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const { pathname, search } = request.nextUrl;
  const onLogin = pathname === "/admin/login";

  // Never redirect form posts (server actions would hang waiting for their result) and don't treat a
  // network hiccup as "signed out": pages and actions run requireMe() themselves.
  const isNavigation = request.method === "GET" || request.method === "HEAD";
  const signedOut = !user && (!error || error.name === "AuthSessionMissingError" || error.status === 401 || error.status === 403);
  if (!isNavigation) return response;

  if (signedOut && !onLogin) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname + search);
    return redirectWith(response, login);
  }
  if (user && onLogin && !request.nextUrl.searchParams.has("error")) {
    return redirectWith(response, new URL("/admin", request.url));
  }
  return response;
}

/** Redirect that keeps any refreshed session cookies. */
function redirectWith(from: NextResponse, to: URL) {
  const res = NextResponse.redirect(to);
  for (const c of from.cookies.getAll()) res.cookies.set(c);
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
