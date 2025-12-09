import ChatCard from "@/app/ui/msg/chat-card";

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
export default async function Home() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 text-xl h-16 flex justify-center items-center border-b">
        聊天
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
