"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { MessageCircleMore, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { AQButton } from "../button";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Avator() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const user = session?.user;
  const t = useTranslations("sign.sign_in");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {user ? (
        <>
          <Link href="/msg">
            <Button variant="outline">
              <MessageCircleMore className="w-5 h-5" />
            </Button>
          </Link>
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
        <Link href="/my">
          <AQButton variant="outline">{t("login_button")}</AQButton>
        </Link>
      )}
    </Suspense>
  );
}
