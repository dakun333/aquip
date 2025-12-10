import { Chat } from "@/app/[locale]/types/msg.type";
import Image from "next/image";
import Tag from "./tag";
import Link from "next/link";

interface IProps {
  chat: Chat;
}
export default function ChatCard({ chat }: IProps) {
  return (
    <Link href="/chat">
      <div className="w-full px-4 py-2 flex items-center gap-2 border-b cursor-pointer hover:bg-gray-100 transition-all">
        <div className="shrink-0">
          <Image
            src={"/avator.svg"}
            width={50}
            height={50}
            alt={chat.name}
          ></Image>
        </div>
        <div className="flex flex-col w-full overflow-x-hidden ">
          <div className="flex justify-between items-center gap-2">
            <div className="truncate">{chat.name}</div>
            <div className="shrink-0 min-w-12 text-end ">{chat.last_at}</div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="truncate text-sm">{chat.content}</div>
            <div className="shrink-0 min-w-12 flex justify-end">
              <Tag count={chat.unread}></Tag>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
