import { Chat } from "@/app/types/msg.type";
import Image from "next/image";
import Tag from "./tag";
interface IProps {
  chat: Chat;
}
export default function ChatCard({ chat }: IProps) {
  return (
    <div className="w-full px-4 py-2 flex items-center gap-2 border-b">
      <div className="shrink-0">
        <Image src={chat.avator} width={50} height={50} alt={chat.name}></Image>
      </div>
      <div className="flex flex-col w-full overflow-x-hidden ">
        <div className="flex justify-between gap-2">
          <div className="truncate">{chat.name}</div>
          <div className="shrink-0 min-w-12 text-end">{chat.last_at}</div>
        </div>
        <div className="shrink-0 flex justify-between gap-2">
          <div className="truncate">{chat.content}</div>
          <div className="shrink-0 min-w-12 flex justify-end">
            <Tag count={chat.unread}></Tag>
          </div>
        </div>
      </div>
    </div>
  );
}
