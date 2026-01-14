"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  CreditCard,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PaymentWebSocket } from "@/lib/payment-websocket";
import { useSearchParams } from "next/navigation";
import { AQButton } from "../button";
interface PaymentOverlayProps {
  open: boolean;
  statuses?: string[]; // 自定义状态列表，如果不提供则使用默认顺序
  interval?: number; // 每个状态显示的时长（毫秒），默认 2000ms
  onComplete?: () => void; // 支付完成回调
  onError?: () => void; // 错误回调
}

export default function PaymentOverlay({
  open,
  statuses,
  interval = 2000,
  onComplete,
  onError,
}: PaymentOverlayProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const t = useTranslations("checkout.payment_status");
  const [currentStatus, setCurrentStatus] = useState<string>("processing");

  const closeHandle = () => {
    if (currentStatus === "processing" || currentStatus === "success") {
      onComplete?.();
    } else if (currentStatus === "failed") {
      onError?.();
    }
  };

  // WebSocket 连接管理
  useEffect(() => {
    if (!open || !id) {
      return;
    }
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return;
    }
    const host = process.env.NEXT_PUBLIC_API_URL.split("://")[1];
    const protocol = location.protocol === "https:" ? "wss" : "wss";
    const url = `${protocol}://${host}/task/progress/${id}`;
    // 创建 WebSocket 连接
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Payment progress message:", message);
      if (message.order_status === "COMPLETED") {
        setCurrentStatus("success");
      } else if (message.order_status === "FAILED") {
        setCurrentStatus("failed");
      }
    };

    ws.onclose = () => {};
    ws.onerror = (event) => {};
    return () => {
      ws.close();
    };
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogContent
        showCloseButton={false}
        className="pointer-events-auto select-none"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col items-center justify-center gap-6 py-8 min-w-[300px]">
          {/* 图标 */}
          <div className="relative">
            {currentStatus === "processing" && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {currentStatus === "failed" && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
            {currentStatus === "completed" && (
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            )}
          </div>

          {/* 文字 */}
          <div className="text-center">
            <p
              className={`text-lg font-medium ${
                currentStatus === "error" || currentStatus === "failed"
                  ? "text-destructive"
                  : currentStatus === "completed"
                  ? "text-green-600"
                  : "text-foreground"
              }`}
            >
              {currentStatus === "error" || currentStatus === "failed"
                ? t("failed") || "支付失败"
                : currentStatus === "completed"
                ? t("completed") || "支付成功"
                : t(currentStatus)}
            </p>
          </div>
          {currentStatus != "processing" && (
            <DialogFooter>
              <AQButton onClick={closeHandle}>
                {t(currentStatus === "failed" ? "close" : "confirm") || "确认"}
              </AQButton>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
