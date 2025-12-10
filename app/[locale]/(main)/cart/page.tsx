import CartList from "@/app/[locale]/ui/cart/list";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Cart() {
  const t = useTranslations("cart");
  return (
    <>
      <div className="h-full flex flex-col ">
        <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
          {t("title")}
          {/* <span className="text-gray-500">({list.length})</span> */}
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Suspense>
            <CartList />
          </Suspense>
        </div>
      </div>
    </>
  );
}
