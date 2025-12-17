import { Button } from "@/components/ui/button";
import LocaleSwitcher from "../lang-switch";
import { Search, ShoppingCart, User } from "lucide-react";

import Avator from "./avator";

export default function HomeHeader() {
  return (
    <>
      <div className="shrink-0 h-20 border-b px-4 flex items-center justify-between md:px-[15%]">
        <div className="text-2xl font-bold cursor-pointer">Aquip</div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher></LocaleSwitcher>
          <Button variant="outline">
            <Search className="w-5 h-5" />
          </Button>
          <Avator />
        </div>
      </div>
    </>
  );
}
