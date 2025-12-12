import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import LocaleSwitcher from "../ui/lang-switch";
import { setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
import { getBilibiliRecommendList } from "@/lib/bilibili.test";
import ProductList from "../ui/home/list";
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const videos = await getBilibiliRecommendList();
  // console.log("b站视频:", videos);

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
        <ProductList />
      </div>

      {/* 底部 */}
    </div>
  );
}
export const revalidate = 60; // 1 分钟 ISR
