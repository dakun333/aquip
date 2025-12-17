import HomeFooter from "../ui/home/footer";
import { setRequestLocale } from "next-intl/server";
import { hasLocale, Locale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { use } from "react";
import { notFound } from "next/navigation";
import HomeHeader from "../ui/home/header";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
interface IProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}
export default async function MainLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="h-full flex flex-col justify-between">
      <HomeHeader />
      <div className="flex-1 overflow-auto">{children}</div>
      <HomeFooter />
    </div>
  );
}
