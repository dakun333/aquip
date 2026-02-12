import { Button } from "@/components/ui/button";
import LocaleSwitcher from "../lang-switch";
import { HandCoins, Search, ShoppingCart, User, Wrench } from "lucide-react";

import Avator from "./avator";
import Link from "next/link";
import { AQButton } from "../button";

export default function HomeHeader() {
  return (
    <>
      <div className="shrink-0 h-20 border-b px-4 flex items-center justify-between md:px-[15%]">
        <a href="/">
          <div className="text-2xl font-bold cursor-pointer">Aquipay</div>
        </a>

        <div className="flex items-center gap-2">
          {/* <Link href="/checkout">
            <AQButton title="支付">
              <HandCoins></HandCoins>
            </AQButton>
          </Link> */}
          {/* <Link href="/admin">
            <AQButton title="后台">
              <Wrench></Wrench>
            </AQButton>
          </Link> */}
          <LocaleSwitcher></LocaleSwitcher>
          {/* <Button variant="outline">
            <Search className="w-5 h-5" />
          </Button>
          <Avator /> */}
        </div>
      </div>
    </>
  );
}
