import { Outlet } from "@remix-run/react";

import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getCurrentSession(request);

  if (session.get("userId")) return redirect("/app");

  return Response.json({ userId: null });
}

export default function AuthLayout() {
  return <Outlet />;
}
