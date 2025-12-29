// app/api/chat/stream/route.ts
// 聊天流式响应 API - 模拟大模型逐字返回

import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export const runtime = "edge"; // 使用 Edge Runtime 支持流式响应

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    logger.info("Stream chat request:", { message });

    // 创建可读流
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 模拟大模型响应
          // 实际项目中这里应该调用真实的 AI API
          const responses = [
            "收到您的消息了！",
            "让我来帮您解答...",
            "这是一个流式响应的示例，",
            "每个字符都会逐个显示出来。",
            "您可以看到文字一个个出现，",
            "就像真人在打字一样。",
          ];

          // 随机选择一个响应
          const response =
            responses[Math.floor(Math.random() * responses.length)];

          // 逐字发送
          for (let i = 0; i < response.length; i++) {
            const char = response[i];

            // 发送数据
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`)
            );

            // 模拟延迟（20-100ms 之间随机）
            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 80 + 20)
            );
          }

          // 发送结束标记
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );

          controller.close();
        } catch (error) {
          logger.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    // 返回流式响应
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    logger.error("Chat stream API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
