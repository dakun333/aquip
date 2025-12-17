import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { inter } from "./ui/fonts";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeHeader from "./ui/home/header";
import { Toaster } from "sonner";
export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "metadata",
  });

  return {
    title: {
      template: `%s | ${t("template")}`,
      default: t("default_title"),
    },
    description: "Aquip 测试demo.",
    metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
  };
}
/**
 * 多语言的布局，必须要放在[lang]下多语言才生效
 * @param props
 * @returns
 */
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  setRequestLocale(locale);
  return (
    <>
      <html lang={locale}>
        <body
          className={`${inter.className} antialiased bg-white flex justify-center`}
        >
          <div className="w-full  h-screen bg-white">
            <NextIntlClientProvider>
              {children}
              <Toaster position="top-center" richColors />
            </NextIntlClientProvider>
          </div>
        </body>
      </html>
    </>
  );
}
