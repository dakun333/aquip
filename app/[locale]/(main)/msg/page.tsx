import ChatCard from "@/app/[locale]/ui/msg/chat-card";
import { Metadata } from "next";
import { Locale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
export async function generateMetadata(
  props: Omit<PageProps<"/[locale]/msg">, "children">
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "msg",
  });

  return {
    title: t("title"),
  };
}
const chatData = {
  id: "1",
  content:
    "这是测试消息这是测试消息这是测试消息这是测试消息这是测试消息这是测试消息这是测试消息这是测试消息这是测试消息这是测试消息",
  last_at: "08:19",
  unread: 199,
  avator: "/globe.svg",
  name: "测试用户",
  tag: "测试标签",
};
export default async function Home({ params }: PageProps<"/[locale]/msg">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("msg");
  return (
    <div className="flex flex-col h-full mx-auto">
      <div className="fle-1 flex flex-col overflow-y-auto">
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
        <ChatCard chat={chatData} />
      </div>
    </div>
  );
}
