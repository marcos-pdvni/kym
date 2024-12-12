import { Link } from "@remix-run/react";
import { buttonVariants } from "../ui/button";

export default function AppWalletLink({ wallet }: any) {
  return (
    <Link
      to="my-wallet"
      className={`${buttonVariants({ variant: "link", size: "sm" })} ${
        wallet?.balance > 0 ? "text-green-600" : "text-red-600"
      }`}
    >
      {wallet?.balance}
    </Link>
  );
}
