// lib/chat-stream.ts
// 聊天流式响应处理工具

import { logger } from "./logger";

export interface StreamMessage {
  token?: string;
  done?: boolean;
  error?: string;
}

export interface StreamOptions {
  onMessage: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}
export interface ChatResponse {
  code: number;
  data: string;
  message: string;
}

export async function sendMessage(
  message: string,
  sessionId: string
): Promise<string> {
  const aiUrl = process.env.NEXT_PUBLIC_AI_URL;
  if (!aiUrl) {
    throw new Error("AI_URL environment variable is not set");
  }
  const response = await fetch(`${aiUrl}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: message,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  console.log("sendMessage data", data);
  return data.code == 1 ? data.data : "抱歉，发生了错误，请重试。";
}
/**
 * 发送消息并接收流式响应
 */
export async function sendStreamMessage(
  message: string,
  sessionId: string,
  options: StreamOptions
) {
  const { onMessage, onComplete, onError } = options;

  try {
    logger.info("Sending stream message:", { message, sessionId });

    // 从环境变量获取 AI_URL，客户端需要使用 NEXT_PUBLIC_ 前缀
    const aiUrl = process.env.NEXT_PUBLIC_AI_URL;
    if (!aiUrl) {
      throw new Error("AI_URL environment variable is not set");
    }

    const response = await fetch(`${aiUrl}/ai/chat_stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    // 读取流式数据
    while (true) {
      const { done, value } = await reader.read();
      logger.info("Stream data:", { done, value });

      if (done) {
        logger.info("Stream completed");
        break;
      }

      // 解码数据
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        logger.info("Stream line:", { line });
        if (line.startsWith("data: ")) {
          if (line.includes("[DONE]")) {
            onComplete();
            return;
          }
          try {
            const data: StreamMessage = JSON.parse(line.slice(6));
            logger.info("Stream data:", { data });
            if (data.error) {
              throw new Error(data.error);
            }

            if (data.done) {
              onComplete();
              return;
            }

            if (data.token) {
              onMessage(data.token);
            }
          } catch (e) {
            logger.error("Failed to parse stream data:", e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    logger.error("Stream message error:", error);
    onError(error as Error);
  }
}

/**
 * 使用 EventSource 接收流式响应（备用方案）
 */
export async function ChunkTransfer(
  message: string,
  sessionId: string,
  onMessage: (content: string) => void
): Promise<void> {
  const aiUrl = process.env.NEXT_PUBLIC_AI_URL;
  if (!aiUrl) {
    throw new Error("AI_URL environment variable is not set");
  }

  try {
    const response = await fetch(`${aiUrl}/ai/chat-chunk-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      logger.info("ChunkTransfer value", value);

      // 解码当前拿到的二进制块
      const rawChunk = decoder.decode(value, { stream: true });

      // 因为一个 Chunk 可能包含多个 JSON 对象（按换行符分割）
      const lines = rawChunk.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        // 处理 SSE 格式：data: {"token": "..."}
        if (line.startsWith("data: ")) {
          try {
            // 提取 data: 后面的 JSON 部分
            const jsonStr = line.slice(6); // 移除 "data: " 前缀

            // 检查是否是结束标记
            if (jsonStr.trim() === "[DONE]") {
              logger.info("Stream completed");
              return;
            }

            const data = JSON.parse(jsonStr);
            logger.info("收到token数据:", data);

            // 提取 token 字段
            if (data.token) {
              onMessage(data.token);
            }
          } catch (e) {
            // 如果 JSON 不完整，说明这个块被切断了，需要缓存处理（此处简化）
            logger.error("解析失败", e, { line });
          }
        } else {
          // 如果不是 data: 格式，尝试直接解析 JSON（兼容其他格式）
          try {
            const data = JSON.parse(line);
            if (data.token) {
              onMessage(data.token);
            } else if (data.text) {
              onMessage(data.text);
            }
          } catch (e) {
            logger.error("解析失败", e, { line });
          }
        }
      }
    }
  } catch (error) {
    logger.error("ChunkTransfer error:", error);
    throw error;
  }
}
