# 聊天系统快速开始 🚀

## 📦 已完成的功能

✅ **4 个核心组件**

- `ChatHeader` - 聊天头部（返回、用户信息、在线状态）
- `MessageList` - 消息列表（自动滚动、空状态）
- `MessageItem` - 单条消息（头像、气泡、时间）
- `ChatInput` - 输入框（文本、图片、文件上传）

✅ **完整的聊天页面**

- `/chat` 路由已实现
- 模拟消息数据和自动回复
- 支持文本、图片、文件三种消息类型

✅ **用户体验**

- 响应式设计（移动端 + 桌面端）
- 平滑滚动动画
- 文件上传预览
- 键盘快捷键（Enter 发送，Shift+Enter 换行）

## 🎯 立即体验

1. **启动开发服务器**

```bash
npm run dev
```

2. **访问聊天页面**

```
http://localhost:3000/chat
```

3. **测试功能**

- ✍️ 输入文本并发送
- 📷 点击图片按钮上传图片
- 📎 点击附件按钮上传文件
- ⌨️ 按 Enter 发送，Shift+Enter 换行

## 🔌 集成到项目

### 方案 1：独立聊天页面（当前实现）

已在 `app/[locale]/chat/page.tsx` 实现，直接访问 `/chat` 即可使用。

### 方案 2：与用户系统集成

使用 `example-integration.tsx` 示例代码：

```typescript
import ChatIntegration from "../ui/chat/example-integration";

export default function ChatWithUser() {
  return (
    <ChatIntegration
      chatId="chat-123"
      recipientId="user-456"
      recipientName="客服小助手"
      recipientAvatar="/avatar.jpg"
    />
  );
}
```

### 方案 3：在任意页面嵌入

```typescript
import { useState } from "react";
import MessageList from "../ui/chat/message-list";
import ChatInput from "../ui/chat/chat-input";

export default function MyPage() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="h-96 flex flex-col border rounded-lg">
      <MessageList messages={messages} />
      <ChatInput
        onSendMessage={(content, file) => {
          // 处理发送逻辑
        }}
      />
    </div>
  );
}
```

## 📱 组件展示

### 消息类型

**文本消息**

```typescript
{
  id: "1",
  content: "你好！",
  senderId: "user1",
  senderName: "张三",
  timestamp: new Date(),
  isCurrentUser: false,
}
```

**图片消息**

```typescript
{
  id: "2",
  content: "",
  type: "image",
  fileUrl: "https://example.com/image.jpg",
  senderId: "user2",
  senderName: "李四",
  timestamp: new Date(),
  isCurrentUser: true,
}
```

**文件消息**

```typescript
{
  id: "3",
  content: "",
  type: "file",
  fileName: "document.pdf",
  fileUrl: "https://example.com/doc.pdf",
  senderId: "user1",
  senderName: "张三",
  timestamp: new Date(),
  isCurrentUser: false,
}
```

## 🎨 样式定制

### 修改主题颜色

**文件**: `app/[locale]/ui/chat/message-item.tsx`

```typescript
// 当前用户消息背景色
"bg-blue-500 text-white";
// 改为
"bg-green-500 text-white"; // 绿色
"bg-purple-500 text-white"; // 紫色
"bg-gradient-to-r from-blue-500 to-purple-500 text-white"; // 渐变

// 对方消息背景色
"bg-gray-100 text-gray-900";
// 改为
"bg-blue-50 text-blue-900"; // 浅蓝色
"bg-green-50 text-green-900"; // 浅绿色
```

### 修改头像样式

**文件**: `app/[locale]/ui/chat/message-item.tsx`

```typescript
// 圆形头像
"w-10 h-10 rounded-full";

// 方形头像
"w-10 h-10 rounded-lg";

// 渐变背景
"bg-gradient-to-br from-blue-400 to-purple-500";
"bg-gradient-to-br from-pink-400 to-red-500";
```

## 🔧 下一步开发

### 1. 连接真实后端

创建以下 API 路由：

```typescript
// app/api/chat/[chatId]/messages/route.ts
export async function GET(req: NextRequest) {
  // 获取历史消息
}

export async function POST(req: NextRequest) {
  // 发送新消息
}
```

```typescript
// app/api/upload/route.ts
export async function POST(req: NextRequest) {
  // 处理文件上传
}
```

### 2. 添加 WebSocket

```bash
npm install socket.io-client
```

```typescript
import { io } from "socket.io-client";

const socket = io("ws://your-server.com");

socket.on("message", (message) => {
  setMessages((prev) => [...prev, message]);
});
```

### 3. 数据持久化

使用 Prisma 创建消息表：

```prisma
model Message {
  id        String   @id @default(cuid())
  content   String
  chatId    String
  senderId  String
  type      String   @default("text")
  fileUrl   String?
  fileName  String?
  createdAt DateTime @default(now())

  sender User @relation(fields: [senderId], references: [id])
  chat   Chat @relation(fields: [chatId], references: [id])

  @@index([chatId])
  @@index([senderId])
}

model Chat {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  messages  Message[]

  participants ChatParticipant[]
}

model ChatParticipant {
  id     String @id @default(cuid())
  chatId String
  userId String

  chat Chat @relation(fields: [chatId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@unique([chatId, userId])
}
```

## 📊 性能建议

### 1. 消息分页

```typescript
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const response = await fetch(
    `/api/chat/${chatId}/messages?before=${messages[0].id}`
  );
  const olderMessages = await response.json();
  setMessages((prev) => [...olderMessages, ...prev]);
};
```

### 2. 虚拟滚动（1000+ 消息时）

```bash
npm install react-window
```

### 3. 图片懒加载

已通过 Next.js Image 组件自动实现 ✅

## 🐛 常见问题

**Q: 消息不显示怎么办？**

- 检查 `messages` 数组是否正确传递
- 查看浏览器控制台是否有错误
- 确认 `isCurrentUser` 字段设置正确

**Q: 文件上传失败？**

- 检查文件大小是否超过 10MB
- 确认后端 API 已实现
- 查看网络请求是否成功

**Q: 如何自定义消息样式？**

- 编辑 `message-item.tsx` 中的 className
- 参考上方"样式定制"部分

**Q: 如何添加表情符号？**

- 推荐使用 `emoji-picker-react` 库
- 在 `ChatInput` 组件中集成

## 📚 相关文档

- [完整开发指南](./CHAT_SYSTEM_GUIDE.md)
- [集成示例代码](./app/[locale]/ui/chat/example-integration.tsx)
- [Next.js 文档](https://nextjs.org/docs)

## 💡 提示

- 使用 logger 工具记录调试信息
- 所有文件都有详细注释
- 组件都是纯 TypeScript，类型安全

---

开始构建你的聊天应用吧！🎉
