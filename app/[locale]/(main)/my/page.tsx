import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { AQButton } from "../../ui/button";
import { Locale } from "next-intl";
import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { headers } from "next/headers";
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
export default async function My({ params }: PageProps<"/[locale]/my">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("my");
  const res = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
          {t("title")}
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center gap-2">
          <div>当前用户名：{res?.user.id}</div>
          <div>当前用户名：{res?.user.name}</div>
          <div>当前用户名：{res?.user.email}</div>

          <Link href="/sign-up">
            <AQButton>注册</AQButton>
          </Link>
          <Link href="/sign-in">
            <AQButton>登录</AQButton>
          </Link>
        </div>
      </div>
    </>
  );
}
