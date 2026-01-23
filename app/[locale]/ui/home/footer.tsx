import { FooterTab } from "../../../types/home.type";
import ActiveLink from "./footer-link";
import { Suspense } from "react";

const tabs: FooterTab[] = [
  { label: "home", href: "/", name: "home" },
  // { label: "home", href: "/home", name: "home" },
  { label: "msg", href: "/msg", name: "msg" },
  // { label: "cart", href: "/cart", name: "cart" },
  { label: "my", href: "/my", name: "my" },
];
export default function HomeFooter() {
  return (
    <>
      <div className="border-t rounded-t-xl h-20 flex bg-white overflow-hidden md:hidden">
        {tabs.map((tab, index) => {
          return (
            <Suspense key={tab.name}>
              <ActiveLink tab={tab} />
            </Suspense>
          );
        })}
      </div>
    </>
  );
}
