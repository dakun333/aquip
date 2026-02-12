import { LayoutDashboard, ShoppingCart, Settings2, LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export const ADMIN_NAV_CONFIG: NavItem[] = [
  {
    title: "总览",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "订单管理",
    url: "/order",
    icon: ShoppingCart,
  },
  {
    title: "配置模块",
    url: "/config",
    icon: Settings2,
  },
];
