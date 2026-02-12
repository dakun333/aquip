// app/[locale]/ui/chat/chat-input.tsx
// 聊天输入框组件 - 支持文本输入和文件上传

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Paperclip, Send, Image as ImageIcon, X } from "lucide-react";
import { AQButton } from "../button";
import { logger } from "@/lib/logger";
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
interface ChatInputProps {
  onSendMessage: (content: string, file?: File) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !selectedFile) {
      return;
    }

    logger.info("Sending message:", {
      message: trimmedMessage,
      hasFile: !!selectedFile,
    });

    onSendMessage(trimmedMessage, selectedFile || undefined);
    setMessage("");
    setSelectedFile(null);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小 (限制10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("文件大小不能超过 10MB");
        return;
      }
      setSelectedFile(file);
      logger.info("File selected:", { name: file.name, size: file.size });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="border-t bg-white p-4">
      {/* 文件预览 */}
      {selectedFile && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            {selectedFile.type.startsWith("image/") ? (
              <ImageIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <Paperclip className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-sm text-gray-700 truncate">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-400">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />

      <InputGroup>
        <InputGroupTextarea
          placeholder="输入消息... (Shift+Enter 换行)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <InputGroupAddon
          align="block-end"
          className="flex items-center gap-2 justify-between"
        >
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-sm"
            type="button"
            onClick={() => imageInputRef.current?.click()}
          >
            <Plus />
          </InputGroupButton>

          {/* 发送按钮 */}
          <InputGroupButton
            variant="default"
            className="rounded-full"
            disabled={!message.trim() && !selectedFile}
            onClick={handleSend}
            size="icon-sm"
            type="button"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
