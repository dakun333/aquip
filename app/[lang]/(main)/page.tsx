import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  HomeIcon,
  Info,
  MessageCircleMore,
  Search,
  ShoppingCart,
  User,
  User2,
} from "lucide-react";
import { Product } from "../types/home.type";
import { headers } from "next/headers";
import Image from "next/image";

import HomeFooter from "../ui/home/footer";
import ProductCard from "../ui/home/card";
import { Suspense } from "react";
import Link from "next/link";
import LocaleSwitcher from "../ui/lang-switch";
export const metadata: Metadata = {
  title: {
    template: "%s | Aquip",
    default: "Aquip",
  },
  description: "Aquip 测试demo.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

async function getProducts(): Promise<Product[]> {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const host = (await headers()).get("host"); // 自动获取当前访问域名，比如 localhost:3000
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(`${protocol}://${host}/api/product`, {
    // cache: "no-store",
  });
  console.log("获取到的数据:", res);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex h-full flex-col bg-white gap-1 justify-between">
      {/* 顶部 */}
      <div className="shrink-0 h-20 border-b px-4 flex items-center justify-between">
        <div className="text-2xl font-bold cursor-pointer">Aquip</div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher></LocaleSwitcher>
          <Button variant="outline">
            <Search className="w-5 h-5" />
          </Button>
          <Link href="/my">
            <Button variant="outline">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-2 gap-2">
          {products.map((item) => (
            <Suspense key={item.id}>
              <ProductCard key={item.id} product={item} />
            </Suspense>
          ))}
        </div>
      </div>

      {/* 底部 */}
    </div>
  );
}
export const revalidate = 60; // 1 分钟 ISR
