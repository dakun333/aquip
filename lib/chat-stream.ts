// lib/chat-stream.ts
// 聊天流式响应处理工具

import { logger } from "./logger";

export interface StreamMessage {
  content?: string;
  done?: boolean;
  error?: string;
}

export interface StreamOptions {
  onMessage: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

/**
 * 发送消息并接收流式响应
 */
export async function sendStreamMessage(
  message: string,
  options: StreamOptions
) {
  const { onMessage, onComplete, onError } = options;

  try {
    logger.info("Sending stream message:", message);

    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
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

      if (done) {
        logger.info("Stream completed");
        break;
      }

      // 解码数据
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data: StreamMessage = JSON.parse(line.slice(6));

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.done) {
              onComplete();
              return;
            }

            if (data.content) {
              onMessage(data.content);
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
export function subscribeToStream(
  messageId: string,
  options: StreamOptions
): () => void {
  const { onMessage, onComplete, onError } = options;

  const eventSource = new EventSource(
    `/api/chat/stream?messageId=${messageId}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data: StreamMessage = JSON.parse(event.data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.done) {
        eventSource.close();
        onComplete();
        return;
      }

      if (data.content) {
        onMessage(data.content);
      }
    } catch (error) {
      logger.error("EventSource message error:", error);
      onError(error as Error);
    }
  };

  eventSource.onerror = (error) => {
    logger.error("EventSource error:", error);
    eventSource.close();
    onError(new Error("Connection error"));
  };

  // 返回取消订阅函数
  return () => {
    eventSource.close();
  };
}
