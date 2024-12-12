import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigation, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { useToast } from "~/hooks/use-toast";
import { newWalletSchema } from "~/lib/schemas";
import { getCurrentSession } from "~/lib/session.server";
import { db } from "~/db.server";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { Text, TextCursorInput, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getCurrentSession(request);
  const userId = session.get("userId");

  const wallet = await db.wallet.findFirst({ where: { userId } });

  if (wallet) return redirect("/app");

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const session = await getCurrentSession(request);
  const userId = session.get("userId");

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    value: formData.get("money") as string,
  };

  const result = newWalletSchema.safeParse(data);

  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const isWalletExisting = await db.wallet.findFirst({ where: { userId } });

  if (isWalletExisting) return null;

  const wallet = await db.wallet.create({
    data: {
      title: result.data.title,
      description: data.description || null,
      balance: result.data.value || 0,
      userId: userId,
    },
  });

  if (wallet) {
    return Response.json({
      ok: true,
      title: "Your wallet was created!",
      description: "You can start managing your finance life and save money.",
    });
  }

  return redirect("/app");
}

export default function CreateWallet() {
  const { toast } = useToast();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const titleError = actionData?.errors?.title;
  const valueError = actionData?.errors?.value;
  const descriptionError = actionData?.errors?.description;

  const isLoading = navigation.formAction === "/create-wallet";

  useEffect(() => {
    if (actionData?.ok) {
      toast({
        title: actionData?.title,
        description: actionData?.description,
      });
    }
  }, [actionData]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>New Wallet Form</CardTitle>
          <CardDescription>
            A Wallet is what it means in real life duh.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-5">
            <div className="w-full flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="title"
                className="w-full text-start gap-2 flex items-center"
              >
                <TextCursorInput className="w-5 h-5" />
                Title
              </Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Wallet as empy as my heart :("
                required
                className={titleError && "border-red-600"}
                disabled={isLoading}
              />
              {titleError && (
                <span className="w-full text-start text-red-600">
                  {titleError[0]}
                </span>
              )}
            </div>
            <div className="w-full flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="money"
                className="w-full text-start gap-2 flex items-center"
              >
                <DollarSign className="w-5 h-5" />
                Add money?
              </Label>
              <Input
                type="text"
                name="money"
                id="money"
                placeholder="Default is empty"
                className={valueError && "border-red-600"}
                disabled={isLoading}
              />
              {valueError && (
                <span className="w-full text-start text-red-600">
                  {valueError[0]}
                </span>
              )}
            </div>
            <div className="w-full flex items-center justify-start flex-col gap-2">
              <Label
                htmlFor="description"
                className="w-full text-start gap-2 flex items-center"
              >
                <Text className="w-5 h-5" />
                Description
              </Label>
              <Textarea
                name="description"
                id="description"
                placeholder="Optional"
                style={{ resize: "none" }}
                className={descriptionError && "border-red-600"}
                disabled={isLoading}
              />
              {descriptionError && (
                <span className="w-full text-start text-red-600">
                  {descriptionError[0]}
                </span>
              )}
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "..." : "Create"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
