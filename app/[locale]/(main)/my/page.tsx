"use client";
import { Metadata } from "next";
import Link from "next/link";

import { AQButton } from "../../ui/button";
import { Locale, useTranslations } from "next-intl";

import { useSession } from "@/lib/auth-client";

export default function My({ params }: PageProps<"/[locale]/my">) {
  const t = useTranslations("my");
  const res = useSession();

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
          {t("title")}
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center gap-2">
          <div>当前用户名：{res?.data?.user.id}</div>
          <div>当前用户名：{res?.data?.user.name}</div>
          <div>当前用户名：{res?.data?.user.email}</div>

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
