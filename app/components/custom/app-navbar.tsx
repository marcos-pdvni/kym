import { Link, Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";

export default function AppNavbar({ user }: any) {
  return (
    <header className="w-full sticky top-0 z-20 p-3 bg-background">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start">
          <Link to="/app" className="font-bold text-indigo-600 text-xl">
            Kym
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
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
