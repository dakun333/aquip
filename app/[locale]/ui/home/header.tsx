import { Button } from "@/components/ui/button";
import LocaleSwitcher from "../lang-switch";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function HomeHeader() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const user = session?.user;
  return (
    <>
      <div className="shrink-0 h-20 border-b px-4 flex items-center justify-between">
        <div className="text-2xl font-bold cursor-pointer">Aquip</div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher></LocaleSwitcher>
          <Button variant="outline">
            <Search className="w-5 h-5" />
          </Button>
          {user ? (
            <>
              <Link href="/cart">
                <Button variant="outline">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/my">
                <Button variant="outline">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
