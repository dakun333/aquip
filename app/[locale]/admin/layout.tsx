import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "admin",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AdminRootLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <>{children}</>;
}
