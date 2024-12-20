import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) throw new Error("SESSION SECRET IS REQUIRED.");

export const storage = createCookieSessionStorage({
  cookie: {
    name: "kymssn",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  },
});

export async function createSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

export async function getCurrentSession(request: Request) {
  return storage.getSession(request.headers.get("cookie"));
}

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    ...(process.env.NODE_ENV === "production"
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);
