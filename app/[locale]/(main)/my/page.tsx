import { Metadata } from "next";
import { Locale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
export async function generateMetadata(
  props: Omit<PageProps<"/[locale]/my">, "children">
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "my",
  });

  return {
    title: t("title"),
  };
}
export default function My({ params }: PageProps<"/[locale]/my">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("my");

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
          {t("title")}
        </div>
        <div className="flex-1 overflow-y-auto"></div>
      </div>
    </>
  );
}
