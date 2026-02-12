"use client";

import { logger } from "./logger";

type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error";

interface PaymentProgressMessage {
  order_id?: string;
  order_status?: "PENDING" | "COMPLETED" | "FAILED" | string;
  progress?: string;
  message?: string;
  [key: string]: unknown;
}

type MessageHandler = (message: PaymentProgressMessage) => void;
type StatusChangeHandler = (status: WebSocketStatus) => void;
type ErrorHandler = (error: Error) => void;

export class PaymentWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private orderId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private status: WebSocketStatus = "disconnected";

  // 事件处理器
  private messageHandlers: MessageHandler[] = [];
  private statusChangeHandlers: StatusChangeHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];

  constructor(orderId: string) {
    this.orderId = orderId;
    // 根据环境判断使用 ws 或 wss
    // 如果 host 包含 localhost 或 127.0.0.1，使用 ws，否则使用 wss
    // 如果 host 已经包含协议，直接使用
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    const host = process.env.NEXT_PUBLIC_API_URL.split("://")[1];
    this.url = `ws://${host}/task/progress/${orderId}`;
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn("WebSocket already connected");
      return;
    }

    if (this.ws?.readyState === WebSocket.CONNECTING) {
      console.warn("WebSocket is connecting");
      return;
    }

    try {
      this.setStatus("connecting");
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        logger.info(`WebSocket connected: ${this.url}`);
        this.setStatus("connected");
        this.reconnectAttempts = 0;
        // this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as PaymentProgressMessage;
          this.handleMessage(data);
        } catch (error) {
          logger.error("Failed to parse WebSocket message:", error);
          this.handleError(new Error("Invalid message format"));
        }
      };

      this.ws.onerror = (error) => {
        logger.error("WebSocket error:", error);
        this.setStatus("error");
        this.handleError(new Error("WebSocket connection error"));
      };

      this.ws.onclose = (event) => {
        logger.info("WebSocket closed:", event.code, event.reason);
        this.setStatus("disconnected");
        this.stopPing();
        this.attemptReconnect();
      };
    } catch (error) {
      logger.error("Failed to create WebSocket:", error);
      this.setStatus("error");
      this.handleError(error as Error);
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // 阻止重连

    if (this.ws) {
      this.ws.onclose = null; // 移除关闭处理器，避免触发重连
      this.ws.close();
      this.ws = null;
    }
    this.setStatus("disconnected");
  }

  /**
   * 发送消息
   */
  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected, cannot send message");
    }
  }

  /**
   * 添加消息处理器
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    // 返回取消订阅的函数
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * 添加状态变化处理器
   */
  onStatusChange(handler: StatusChangeHandler): () => void {
    this.statusChangeHandlers.push(handler);
    // 返回取消订阅的函数
    return () => {
      this.statusChangeHandlers = this.statusChangeHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  /**
   * 添加错误处理器
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    // 返回取消订阅的函数
    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * 获取当前状态
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * 获取当前连接状态
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: PaymentProgressMessage): void {
    console.log("Received WebSocket message:", message);
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    });
  }

  /**
   * 处理错误
   */
  private handleError(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error("Error in error handler:", err);
      }
    });
  }

  /**
   * 设置状态并通知处理器
   */
  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.statusChangeHandlers.forEach((handler) => {
        try {
          handler(status);
        } catch (error) {
          console.error("Error in status change handler:", error);
        }
      });
    }
  }

  /**
   * 尝试重连
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    if (this.reconnectTimer) {
      return; // 已经在重连中
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  /**
   * 启动心跳检测
   */
  private startPing(): void {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: "ping" });
      }
    }, 30000); // 每30秒发送一次心跳
  }

  /**
   * 停止心跳检测
   */
  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
