import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { storage, getCurrentSession } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getCurrentSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
