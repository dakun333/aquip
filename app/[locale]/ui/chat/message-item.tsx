// app/[locale]/ui/chat/message-item.tsx
// 聊天消息组件 - 显示单条消息

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isCurrentUser: boolean;
  type?: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
}

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const {
    content,
    senderName,
    senderAvatar,
    timestamp,
    isCurrentUser,
    type = "text",
    fileUrl,
    fileName,
  } = message;

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 px-4",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* 头像 */}
      <div className="shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
          {senderAvatar ? (
            <Image
              src={senderAvatar}
              alt={senderName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-sm">
              {senderName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* 消息内容 */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {/* 发送者名称 */}
        <div className="text-xs text-gray-500 mb-1 px-2">{senderName}</div>

        {/* 消息气泡 */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 break-words",
            isCurrentUser
              ? "bg-blue-500 text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-900 rounded-tl-sm"
          )}
        >
          {type === "text" && (
            <p className="text-sm leading-relaxed">{content}</p>
          )}

          {type === "image" && fileUrl && (
            <div className="relative w-48 h-48 rounded-lg overflow-hidden">
              <Image
                src={fileUrl}
                alt="image"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {type === "file" && fileUrl && (
            <a
              href={fileUrl}
              download={fileName}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">{fileName}</span>
            </a>
          )}
        </div>

        {/* 时间戳 */}
        <div className="text-xs text-gray-400 mt-1 px-2">
          {new Date(timestamp).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
