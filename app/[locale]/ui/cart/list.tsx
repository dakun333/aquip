"use client";

// import { headers } from "next/headers";
import CartCard from "./cartCard";
import { useEffect, useState } from "react";
import { Shop } from "@/app/[locale]/types/cart.type";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AQButton } from "../button";
import { formatMoney } from "@/app/[locale]/utils/format";
import { useRouter } from "next/navigation";
const fetchList = async () => {
  // const host = (await headers()).get("host"); // 自动获取当前访问域名，比如 localhost:3000
  // const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(`/api/cart`, {
    // cache: "no-store",
  });
  console.log("获取到的数据:", res);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const json = await res.json();
  return json.data;
};
export default function CartList() {
  const router = useRouter();
  const [cart, setCart] = useState<Shop[]>([]);
  const [selectNum, setSelectNum] = useState<number>(2);
  const [money, setMoney] = useState({
    total: 999,
    discount: 333,
    pay: 666,
  });
  const getList = async () => {
    try {
      const list = await fetchList();
      setCart(list);
    } catch (error) {
      console.log(error);
    }
  };
  const payHandle = () => {
    router.push("/checkout");
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="flex-1 flex flex-col justify-between h-full w-full bg-gray-100">
      <div className="grow md:p-4 pt-1.5 flex flex-col  gap-2 overflow-y-auto">
        {cart.map((shop) => (
          <CartCard key={shop.id} shop={shop} />
        ))}
      </div>
      <div className="flex-none grow-0 p-2 text-xl flex justify-between items-center gap-2  bg-white">
        <div className="shrink-0 flex items-center">
          <Checkbox />
          <span className="ml-1.5 text-sm ">全选</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end text-xs">
            <span className="">
              <span className="">
                合计：
                <span className="text-base text-[red]">
                  {formatMoney(money.pay)}
                </span>
              </span>
            </span>
            <span className="">
              共减：
              <span className="text-sm text-[red]">
                {formatMoney(money.discount)}
              </span>
            </span>
          </div>
          <AQButton disabled={selectNum == 0} onClick={payHandle}>
            领券结算（{selectNum}）
          </AQButton>
        </div>
      </div>
    </div>
  );
}
