import CartList from "@/app/[locale]/ui/cart/list";
import { Locale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";
export async function generateMetadata(
  props: Omit<PageProps<"/[locale]/cart">, "children">
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "cart",
  });

  return {
    title: t("title"),
  };
}
/**
 * 加了async之后就不能使用 use和useTranslations
 * @param param0
 * @returns
 */
export default async function Cart({ params }: PageProps<"/[locale]/cart">) {
  // const { locale } = use(params);
  // setRequestLocale(locale as Locale);
  // const t = useTranslations("cart");
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("cart");
  return (
    <>
      <div className="h-full flex flex-col  max-w-[100vw] ">
        <div className="flex-1 flex flex-col overflow-y-auto ">
          <Suspense>
            <CartList />
          </Suspense>
        </div>
      </div>
    </>
  );
}
