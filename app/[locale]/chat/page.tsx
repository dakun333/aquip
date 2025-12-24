"use client";

import { useState } from "react";
import MessageList from "../ui/chat/message-list";
import ChatInput from "../ui/chat/chat-input";
import type { Message } from "../ui/chat/message-item";
import { logger } from "@/lib/logger";
import BackHeader from "../ui/backHeader";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUpIcon, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";
// 模拟消息数据
const initialMessages: Message[] = [
  {
    id: "1",
    content: "你好！有什么可以帮助你的吗？",
    senderId: "other",
    senderName: "客服小助手",
    timestamp: new Date(Date.now() - 3600000),
    isCurrentUser: false,
  },
  {
    id: "2",
    content: "你好，我想咨询一下订单的问题",
    senderId: "current",
    senderName: "我",
    timestamp: new Date(Date.now() - 3500000),
    isCurrentUser: true,
  },
  {
    id: "3",
    content: "好的，请告诉我您的订单号，我来帮您查询一下",
    senderId: "other",
    senderName: "客服小助手",
    timestamp: new Date(Date.now() - 3400000),
    isCurrentUser: false,
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const chatInfo = {
    userName: "客服小助手",
    userAvatar: "/avatar.jpg",
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    setIsSending(true);

    try {
      // 创建新消息
      const newMessage: Message = {
        id: Date.now().toString(),
        content: content || (file ? `发送了文件: ${file.name}` : ""),
        senderId: "current",
        senderName: "我",
        timestamp: new Date(),
        isCurrentUser: true,
        type: file
          ? file.type.startsWith("image/")
            ? "image"
            : "file"
          : "text",
        fileName: file?.name,
        // 在实际应用中，这里应该上传文件到服务器并获取 URL
        fileUrl: file ? URL.createObjectURL(file) : undefined,
      };

      // 添加到消息列表
      setMessages((prev) => [...prev, newMessage]);

      logger.info("Message sent successfully", { messageId: newMessage.id });

      // 模拟对方回复（延迟1秒）
      setTimeout(() => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: file
            ? "我已收到您的文件，正在处理中..."
            : "收到您的消息了！",
          senderId: "other",
          senderName: "客服小助手",
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 1000);
    } catch (error) {
      logger.error("Failed to send message:", error);
      alert("发送失败，请重试");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 聊天头部 */}
      <BackHeader showBack={false}>{chatInfo.userName}</BackHeader>

      {/* 消息列表 */}
      <MessageList messages={messages} />

      {/* 输入框 */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
