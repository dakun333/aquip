# 聊天系统开发指南

本项目实现了一个完整的聊天对话界面，支持文本消息、图片和文件发送。

## 🎨 功能特性

### 1. **消息显示**

- ✅ 双方头像显示
- ✅ 消息气泡（发送方蓝色，接收方灰色）
- ✅ 发送者名称
- ✅ 消息时间戳
- ✅ 支持文本、图片、文件三种消息类型
- ✅ 自动滚动到最新消息

### 2. **输入功能**

- ✅ 多行文本输入
- ✅ Shift+Enter 换行
- ✅ Enter 发送
- ✅ 图片上传（支持图片预览）
- ✅ 文件上传（显示文件名和大小）
- ✅ 文件大小限制（10MB）
- ✅ 附件预览和删除

### 3. **用户体验**

- ✅ 在线状态显示
- ✅ 返回按钮
- ✅ 优雅的加载状态
- ✅ 空状态提示
- ✅ 平滑滚动动画

## 📁 文件结构

```
app/
  └── [locale]/
      ├── chat/
      │   └── page.tsx              # 聊天主页面
      └── ui/
          └── chat/
              ├── chat-header.tsx   # 聊天头部组件
              ├── message-list.tsx  # 消息列表组件
              ├── message-item.tsx  # 单条消息组件
              └── chat-input.tsx    # 输入框组件
```

## 🧩 组件说明

### 1. ChatHeader (聊天头部)

显示对方信息和操作按钮。

```typescript
<ChatHeader
  userName="客服小助手"
  userAvatar="/avatar.jpg" // 可选
  isOnline={true} // 可选，默认 false
/>
```

**功能：**

- 返回按钮
- 用户头像和名称
- 在线状态指示器
- 更多操作按钮

### 2. MessageList (消息列表)

展示所有聊天消息。

```typescript
<MessageList messages={messages} />
```

**功能：**

- 自动滚动到最新消息
- 空状态提示
- 平滑滚动动画
- 自定义滚动条样式

### 3. MessageItem (单条消息)

渲染单条消息，包含头像和内容。

```typescript
interface Message {
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
```

**样式：**

- 当前用户：蓝色气泡，右对齐
- 其他用户：灰色气泡，左对齐
- 支持文本、图片、文件三种类型

### 4. ChatInput (输入框)

消息输入和文件上传。

```typescript
<ChatInput
  onSendMessage={(content, file) => {
    // 处理发送逻辑
  }}
  disabled={false} // 可选，禁用输入
/>
```

**功能：**

- 多行文本输入
- 图片上传按钮
- 文件上传按钮
- 文件预览和删除
- 发送按钮
- 键盘快捷键

## 🎯 使用示例

### 基础用法

```typescript
"use client";

import { useState } from "react";
import ChatHeader from "../ui/chat/chat-header";
import MessageList from "../ui/chat/message-list";
import ChatInput from "../ui/chat/chat-input";
import type { Message } from "../ui/chat/message-item";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string, file?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: "current-user-id",
      senderName: "我",
      timestamp: new Date(),
      isCurrentUser: true,
      type: file ? (file.type.startsWith("image/") ? "image" : "file") : "text",
      fileName: file?.name,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader userName="对方名称" isOnline={true} />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
```

### 与后端 API 集成

```typescript
const handleSendMessage = async (content: string, file?: File) => {
  try {
    // 1. 如果有文件，先上传文件
    let fileUrl: string | undefined;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      fileUrl = uploadData.url;
    }

    // 2. 发送消息到服务器
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        fileUrl,
        fileName: file?.name,
        type: file
          ? file.type.startsWith("image/")
            ? "image"
            : "file"
          : "text",
      }),
    });

    const data = await response.json();

    // 3. 添加到本地消息列表
    setMessages((prev) => [...prev, data.message]);
  } catch (error) {
    console.error("Failed to send message:", error);
    alert("发送失败，请重试");
  }
};
```

### 实时消息接收 (WebSocket)

```typescript
useEffect(() => {
  // 连接 WebSocket
  const ws = new WebSocket("ws://your-server.com/chat");

  ws.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    setMessages((prev) => [...prev, newMessage]);
  };

  return () => {
    ws.close();
  };
}, []);
```

## 🎨 样式定制

### 修改消息气泡颜色

编辑 `message-item.tsx`:

```typescript
<div
  className={cn(
    "rounded-2xl px-4 py-2 break-words",
    isCurrentUser
      ? "bg-green-500 text-white"  // 改为绿色
      : "bg-blue-100 text-gray-900" // 改为蓝色
  )}
>
```

### 修改头像样式

编辑 `message-item.tsx` 或 `chat-header.tsx`:

```typescript
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500">
```

### 调整输入框高度

编辑 `chat-input.tsx`:

```typescript
<textarea
  style={{
    minHeight: "60px", // 最小高度
    maxHeight: "200px", // 最大高度
  }}
/>
```

## 📱 响应式设计

所有组件都支持移动端和桌面端：

- 消息气泡最大宽度 70%
- 输入框自适应高度
- 触摸友好的按钮大小
- 滚动条自动隐藏（移动端）

## 🔒 安全考虑

### 1. 文件上传安全

```typescript
// 限制文件大小
if (file.size > 10 * 1024 * 1024) {
  alert("文件大小不能超过 10MB");
  return;
}

// 限制文件类型
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
if (!allowedTypes.includes(file.type)) {
  alert("不支持的文件类型");
  return;
}
```

### 2. XSS 防护

消息内容会自动转义，但如果显示 HTML 内容需要使用 `dangerouslySetInnerHTML` 时要小心：

```typescript
// ❌ 危险
<div dangerouslySetInnerHTML={{ __html: message.content }} />;

// ✅ 安全 - 使用 DOMPurify
import DOMPurify from "isomorphic-dompurify";
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(message.content),
  }}
/>;
```

## 📊 性能优化

### 1. 虚拟滚动（大量消息时）

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <MessageItem message={messages[index]} />
    </div>
  )}
</FixedSizeList>;
```

### 2. 图片懒加载

在 `message-item.tsx` 中使用 Next.js Image 组件已经自动实现了懒加载。

### 3. 消息分页

```typescript
const loadMoreMessages = async () => {
  const response = await fetch(`/api/messages?before=${messages[0].id}`);
  const olderMessages = await response.json();
  setMessages((prev) => [...olderMessages, ...prev]);
};
```

## 🧪 测试建议

### 单元测试

```typescript
// message-item.test.tsx
import { render, screen } from "@testing-library/react";
import MessageItem from "./message-item";

test("renders message content", () => {
  const message = {
    id: "1",
    content: "Hello World",
    senderId: "user1",
    senderName: "Test User",
    timestamp: new Date(),
    isCurrentUser: true,
  };

  render(<MessageItem message={message} />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
```

### E2E 测试

```typescript
// chat.spec.ts (Playwright)
test("can send a message", async ({ page }) => {
  await page.goto("/chat");

  await page.fill("textarea", "Hello!");
  await page.click("button:has-text('发送')");

  await expect(page.locator("text=Hello!")).toBeVisible();
});
```

## 🚀 未来增强

- [ ] 表情符号选择器
- [ ] @提及功能
- [ ] 消息已读状态
- [ ] 语音消息
- [ ] 视频通话
- [ ] 消息撤回
- [ ] 消息引用回复
- [ ] Markdown 支持
- [ ] 代码高亮
- [ ] 消息搜索
- [ ] 聊天记录导出

## 📝 注意事项

1. **消息持久化**: 当前实现使用本地状态，刷新页面会丢失消息。需要连接后端 API 保存消息。

2. **文件存储**: 示例代码使用 `URL.createObjectURL()` 创建临时 URL，实际应用需要上传到服务器或 CDN。

3. **实时通信**: 示例使用模拟回复，实际应用需要 WebSocket 或轮询实现实时消息。

4. **用户认证**: 需要集成现有的 Better Auth 系统获取当前用户信息。

---

**版本**: 1.0  
**最后更新**: 2025-12-24  
**维护者**: AI Assistant
