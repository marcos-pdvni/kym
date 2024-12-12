import { Link, Form } from "@remix-run/react";
import { Button, buttonVariants } from "../ui/button";
import { LogOutIcon, PlusSquare } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import AppWalletLink from "./app-wallet-link";

export default function AppNavbar({ user }: any) {
  return (
    <header className="w-full sticky top-0 z-20 p-3 bg-background">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start">
          <Link to="/app" className="font-bold text-xl">
            Kym
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
          <div className="flex items-center justify-center gap-2">
            {user?.wallet ? (
              <AppWalletLink wallet={user?.wallet} />
            ) : (
              <Link
                to="/create-wallet"
                className={`${buttonVariants({
                  size: "sm",
                })} flex items-center justify-center gap-2`}
              >
                <PlusSquare className="w-5 h-5" />
                New Wallet
              </Link>
            )}
          </div>
          <ThemeToggle />
          <Form method="post" action="/logout">
            <Button
              type="submit"
              className="flex items-center justify-center gap-2"
              variant="outline"
            >
              <LogOutIcon className="w-5 h-5" />
              Logout
            </Button>
          </Form>
        </div>
      </nav>
    </header>
  );
}
