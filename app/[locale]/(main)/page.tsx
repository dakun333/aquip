import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import LocaleSwitcher from "../ui/lang-switch";
import { setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
import { getBilibiliRecommendList } from "@/lib/bilibili.test";
import ProductList from "../ui/home/list";
import HomeHeader from "../ui/home/header";
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const videos = await getBilibiliRecommendList();
  // console.log("b站视频:", videos);

  return (
    <div className="flex h-full flex-col bg-white gap-1 justify-between">
      {/* 顶部 */}
      <HomeHeader></HomeHeader>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-2">
        <ProductList />
      </div>

      {/* 底部 */}
    </div>
  );
}
export const revalidate = 60; // 1 分钟 ISR
