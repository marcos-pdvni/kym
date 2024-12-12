import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { buttonVariants, Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { User, Lock } from "lucide-react";

import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import { Form, useActionData, Link, useNavigation } from "@remix-run/react";

import { z } from "zod";
import { loginSchema } from "~/lib/schemas";
import { createSession } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data: z.infer<typeof loginSchema> = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const valResult = loginSchema.safeParse(data);

  if (!valResult.success) {
    return Response.json(
      { errors: valResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { email: data.email } });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    return Response.json(
      { errors: "Invalid email or password." },
      { status: 401 }
    );
  }

  return createSession(user.id, "/app");
}

export default function SignInPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const signinError = actionData?.errors;

  const isLoading = navigation.formAction === "/sign-in";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background">
      <Card>
        <CardHeader>
          <CardTitle>Kym</CardTitle>
          <CardDescription>
            Login to Kym and start managing your finance now!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Form method="post" className="space-y-5">
            <div className="flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="email"
                className="w-full flex items-center justify-start gap-2"
              >
                <User className="w-5 h-5" />
                Email
              </Label>
              <Input
                name="email"
                type="email"
                id="email"
                placeholder="Email"
                className={signinError && "border-red-600"}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-start flex-col gap-1">
              <Label
                htmlFor="password"
                className="w-full flex items-center justify-start gap-2"
              >
                <Lock className="w-5 h-5" />
                Password
              </Label>
              <Input
                name="password"
                type="password"
                id="password"
                placeholder="Password"
                className={signinError && "border-red-600"}
                disabled={isLoading}
              />
            </div>
            <div>
              {signinError && (
                <span className="w-full text-start text-red-600">
                  {signinError}
                </span>
              )}
            </div>
            <Button
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Sign In"}
            </Button>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="leading-7 [&:not(:first-child)]:mt-6 inline-block">
            No account yet?
          </p>
          <Link
            to="/sign-up"
            className={`${buttonVariants({ variant: "link" })}`}
          >
            Create
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
