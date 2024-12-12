import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "~/lib/session.server";
import { db } from "~/db.server";
import { Toaster } from "~/components/ui/toaster";

import AppNavbar from "~/components/custom/app-navbar";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getCurrentSession(request);

  const userId = session.get("userId");

  if (!userId) return redirect("/sign-in");

  const user = await db.user.findFirst({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      id: true,
      wallet: {
        select: {
          balance: true,
          budgets: { select: { balanceNow: true } },
        },
      },
    },
  });

  return Response.json({ user: user });
}

export default function AppLayout() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="w-full min-h-screen">
      <AppNavbar user={loaderData?.user} />
      <Outlet />
      <Toaster />
    </div>
  );
}
