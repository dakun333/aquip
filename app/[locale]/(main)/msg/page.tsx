import ChatCard from "@/app/[locale]/ui/msg/chat-card";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

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
export default function Home({ params }: PageProps<"/[locale]/msg">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);

  const t = useTranslations("msg");
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
        {t("title", { num: 0 })}
      </div>
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
