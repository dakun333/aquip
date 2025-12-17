import { setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";

import ProductList from "../ui/home/list";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <div className="flex h-full flex-col bg-white gap-1 justify-between">
      {/* 顶部 */}

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-2">
        <ProductList />
      </div>

      {/* 底部 */}
    </div>
  );
}
export const revalidate = 60; // 1 分钟 ISR
