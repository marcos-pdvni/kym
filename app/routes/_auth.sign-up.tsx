import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import type { User } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, Link, useNavigation } from "@remix-run/react";
import { db } from "~/db.server";
import bcrypt from "bcryptjs";

import { User as UserIcon, Lock, Text } from "lucide-react";

import { z } from "zod";
import { signupSchema } from "~/lib/schemas";
import { createSession } from "~/lib/session.server";

const saltHash = 10;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data: z.infer<typeof signupSchema> = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = signupSchema.safeParse(data);

  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { email: data.email } });

  if (user) {
    return Response.json(
      { errors: "User already signed-up." },
      { status: 400 }
    );
  }

  const hashPwd = await bcrypt.hash(result.data.password, saltHash);

  const newUser: User = await db.user.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      password: hashPwd,
    },
  });

  return createSession(newUser.id, "/app");
}

export default function SignUpPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const nameError = actionData?.errors?.name;
  const emailError = actionData?.errors?.email;
  const passwordError = actionData?.errors?.password;
  const confirmPasswordError = actionData?.errors?.confirmPassword;
  const signupError = actionData?.errors;

  const isLoading = navigation.formAction === "/sign-up";

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-background">
      <Card>
        <CardHeader>
          <CardTitle>Kym</CardTitle>
          <CardDescription>
            Sign up to Kym and start taking care of your finances with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-5" method="post">
            <div className="flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="name"
                className="w-full flex items-center justify-start gap-2"
              >
                <Text className="w-5 h-5" />
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                required
                disabled={isLoading}
                className={nameError && "border-red-600"}
              />
              {nameError && (
                <span className="w-full text-start text-red-600">
                  {nameError[0]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="email"
                className="w-full flex items-center justify-start gap-2"
              >
                <UserIcon className="w-5 h-5" />
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="johndoe@example.com"
                required
                disabled={isLoading}
                className={emailError && "border-red-600"}
              />
              {emailError && (
                <span className="w-full text-start text-red-600">
                  {emailError[0]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="password"
                className="w-full flex items-center justify-start gap-2"
              >
                <Lock className="w-5 h-5" />
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="********"
                required
                disabled={isLoading}
                className={passwordError && "border-red-600"}
              />
              {passwordError && (
                <div className="w-full flex items-center justify-start flex-col gap-1">
                  {passwordError.map((error: string) => (
                    <span className="w-full text-start text-red-600">
                      {error}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="confirmPassword"
                className="w-full flex items-center justify-start gap-2"
              >
                <Lock className="w-5 h-5" />
                Confirm Password
              </Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="********"
                required
                disabled={isLoading}
                className={confirmPasswordError && "border-red-600"}
              />
              {confirmPasswordError && (
                <span className="w-full text-start text-red-600">
                  {confirmPasswordError[0]}
                </span>
              )}
              {signupError && (
                <span className="w-full text-start text-red-600">
                  {signupError}
                </span>
              )}
            </div>
            <Button
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Sign Up"}
            </Button>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="leading-7 [&:not(:first-child)]:mt-6 inline-block">
            Already have an account?
          </p>
          <Link
            to="/sign-in"
            className={`${buttonVariants({ variant: "link" })}`}
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
