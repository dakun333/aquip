import CartList from "@/app/[lang]/ui/cart/list";
import { Suspense } from "react";

export default function Cart() {
  return (
    <>
      <div className="h-full flex flex-col ">
        <div className="shrink-0 text-xl h-16 flex justify-center items-center border-b">
          购物车
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
