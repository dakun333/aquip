"use client";

import { Locale, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation"; // Next.js 客户端 Hooks
import { AQButton } from "./button";

import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeNames, routing } from "@/i18n/routing";
import clsx from "clsx";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  // 1. 获取当前的语言前缀 (例如 '/zh/dashboard' -> '/zh')
  const currentLocaleSegment = routing.localePrefix;
  // console.log("当前语言前缀:", currentLocaleSegment);
  const handleLocaleChange = (newLocale: Locale) => {
    // 2. 构造新的路径：替换当前 URL 中的语言参数
    // 例如：将 /zh/dashboard 变成 /en/dashboard
    // 分割路径：['', 'zh', 'dashboard']
    const segments = pathname.split("/");

    // 替换索引 1 处的语言代码
    segments[0] = newLocale;

    // 合并路径：/en/dashboard
    const newPath = segments.join("/");
    // 3. 使用 router.push 进行客户端导航
    router.push(newPath);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <AQButton variant="outline" size="icon">
            <Languages />
          </AQButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          {routing.locales.map((locale) => (
            <AQButton
              key={locale}
              variant="ghost"
              className={clsx(
                "cursor-pointer px-2 py-1 w-full  justify-start hover:text-blue-600",
                locale === currentLocale ? "text-red-600" : ""
              )}
              size="sm"
              onClick={() => handleLocaleChange(locale)}
            >
              {localeNames[locale]}
            </AQButton>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
