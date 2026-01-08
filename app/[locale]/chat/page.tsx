"use client";

import { useState, useRef } from "react";
import MessageList from "../ui/chat/message-list";
import ChatInput from "../ui/chat/chat-input";
import type { Message } from "../ui/chat/message-item";
import { logger } from "@/lib/logger";
import BackHeader from "../ui/backHeader";
import {
  ChunkTransfer,
  sendMessage,
  sendStreamMessage,
} from "@/lib/chat-stream";
import { authClient } from "@/lib/auth-client";
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
  const [isReceiving, setIsReceiving] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const streamingMessageRef = useRef<string>("");
  const streamingMessageIdRef = useRef<string>("");
  // 尝试多种方式获取 session_id
  const sessionId = 9999;

  const chatInfo = {
    userName: "AI 助手",
    userAvatar: "/avatar.jpg",
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    setIsSending(true);

    try {
      // 1. 创建用户消息
      const userMessage: Message = {
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
        fileUrl: file ? URL.createObjectURL(file) : undefined,
      };

      // 添加用户消息
      setMessages((prev) => [...prev, userMessage]);
      logger.info("User message sent", { messageId: userMessage.id });

      // 2. 如果是文件，使用简单回复
      if (file) {
        setTimeout(() => {
          const replyMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "我已收到您的文件，正在处理中...",
            senderId: "ai",
            senderName: "AI 助手",
            timestamp: new Date(),
            isCurrentUser: false,
          };
          setMessages((prev) => [...prev, replyMessage]);
        }, 500);
        return;
      }

      // 3. 文本消息：创建空的 AI 消息用于流式更新
      const aiMessageId = (Date.now() + 1).toString();
      streamingMessageIdRef.current = aiMessageId;
      streamingMessageRef.current = "";

      const aiMessage: Message = {
        id: aiMessageId,
        content: "",
        senderId: "ai",
        senderName: "AI 助手",
        timestamp: new Date(),
        isCurrentUser: false,
      };

      // 先添加空消息到列表
      setMessages((prev) => [...prev, aiMessage]);
      setIsReceiving(true);
      setStreamingContent("");
      streamingMessageRef.current = "";

      // 发送流式请求
      try {
        await ChunkTransfer((content: string) => {
          // logger.info("最新的msg:", content, streamingMessageRef.current);
          // 累积内容到 ref
          streamingMessageRef.current += content;
          // 更新 state 以触发重新渲染
          setStreamingContent(streamingMessageRef.current);

          // 实时更新消息内容
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: streamingMessageRef.current }
                : msg
            )
          );
        });
        setIsReceiving(false);
      } catch (error) {
        logger.error("ChunkTransfer error:", error);
        setIsReceiving(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: "抱歉，发生了错误，请重试。" }
              : msg
          )
        );
      }
      return;

      // 4. 发送流式请求，按 token 逐个显示
      await sendStreamMessage(content, sessionId.toString(), {
        onMessage: (chunk: string) => {
          logger.info("最新的msg:", { chunk });
          // 累积内容
          streamingMessageRef.current += chunk;
        },
        onComplete: () => {
          logger.success("Stream completed");
          setIsReceiving(false);
          aiMessage.content = streamingMessageRef.current;
          // 更新消息内容，逐个 token 显示
          setMessages((prev) => [...prev, aiMessage]);
          // streamingMessageRef.current = "";
        },
        onError: (error) => {
          logger.error("Stream error:", error);
          setIsReceiving(false);

          // 显示错误消息
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: "抱歉，发生了错误，请重试。" }
                : msg
            )
          );
          streamingMessageRef.current = "";
        },
      });
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

      {/* AI 正在输入提示 */}
      {isReceiving && (
        <div className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span>AI 正在输入中...</span>
        </div>
      )}

      {/* 输入框 */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
