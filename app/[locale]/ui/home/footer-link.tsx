"use client";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

import { HomeIcon, MessageCircleMore, ShoppingCart, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FooterTab } from "../../../types/home.type";
const iconMap = {
  home: HomeIcon,
  msg: MessageCircleMore,
  cart: ShoppingCart,
  my: User2,
};
interface IProps {
  tab: FooterTab;
}
// 接收整个 Tab 数据
export default function ActiveLink({ tab }: IProps) {
  const pathname = usePathname();
  const t = useTranslations("home.tabs");
  const isActive = pathname === tab.href;
  const Icon = iconMap[tab.name as keyof typeof iconMap]; // 查找组件

  if (!Icon) return null; // 安全检查
  return (
    <Link
      href={tab.href}
      className={clsx(
        "flex-1 flex flex-col items-center justify-center h-full cursor-pointer gap-1 i",
        {
          "bg-sky-100 text-blue-600": isActive,
        }
      )}
    >
      <Icon size={25} />
      {t(tab.label)}
    </Link>
  );
}
