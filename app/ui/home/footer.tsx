"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { HomeIcon, MessageCircleMore, ShoppingCart, User2 } from "lucide-react";
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

const tabs = [
  { icon: HomeIcon, label: "Home", href: "/" },
  { icon: MessageCircleMore, label: "Message", href: "/msg" },
  { icon: ShoppingCart, label: "Cart", href: "/cart" },
  { icon: User2, label: "User", href: "/user" },
];
export default function HomeFooter() {
  const pathname = usePathname();
  return (
    <>
      <div className="border-t rounded-t-xl h-20 flex bg-white overflow-hidden">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <Link
              key={index}
              href={tab.href}
              className={clsx(
                "flex-1 flex flex-col items-center justify-center h-full cursor-pointer gap-1 i",
                {
                  "bg-sky-100 text-blue-600": pathname === tab.href,
                }
              )}
            >
              <Icon size={25} />
              {/* <span className="text-xs text-gray-600">{tab.label}</span> */}
            </Link>
          );
        })}
      </div>
    </>
  );
}
