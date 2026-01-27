"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { useState } from "react";
import { AQButton } from "../button";
import Countdown from "./count-down";
import { useTranslations } from "next-intl";
import { PayOTP } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface VerifyCodeDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  phone: string;
  orderId?: string; // 订单 ID，从 props 传入而不是从 URL 读取
  seconds?: number; // 默认倒计时秒数
  onSubmit?: () => void;
}

export default function VerifyCodeDialog({
  open,
  onOpenChange,
  phone,
  orderId,
  seconds = 60,
  onSubmit,
}: VerifyCodeDialogProps) {
  const id = orderId;
  const t = useTranslations("checkout");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      // 关闭弹窗时重置输入
      setCode("");
      setLoading(false);
    }
    onOpenChange(v);
  };

  const submitHandler = async () => {
    // 验证：非空且最多10位数字
    if (code.length === 0 || code.length > 10 || !id) return;
    setLoading(true);
    try {
      const params = {
        order_id: id || "",
        otp: code,
      };
      const response = await PayOTP(params);
      if (response.success) {
        logger.info("PayOTP response success:", response);
        // onSubmit();
      } else {
        logger.error("PayOTP response:", response.error);
        toast.error(response.error);
      }

      handleOpenChange(false);
      onSubmit?.();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-xl w-[85vw] max-w-[300px] sm:w-[340px] flex flex-col items-center justify-center gap-4 aspect-45/48">
        <Image src="/safe.svg" alt="safe" width={64} height={64} />
        <DialogHeader className="w-full">
          <DialogTitle className="text-center text-base font-semibold">
            {t("verify_title")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-xs text-gray-500">
          {t("verify_desc")}
          {/* <div className="text-xs text-gray-500 font-medium">{phone}</div> */}
        </DialogDescription>
        <div className="flex flex-col items-center text-center gap-3 my-2">
        <Input 
          type="text" 
          inputMode="numeric"
          maxLength={10} 
          value={code} 
          onChange={(e) => {
            // 只允许数字
            const value = e.target.value.replace(/\D/g, "");
            setCode(value);
          }}
          placeholder={t("verify_code_placeholder") }
        />

         

          {/* Confirm */}
          <AQButton
            className="bg-blue-600 w-[80%] mt-2"
            disabled={code.length === 0 || code.length > 10}
            loading={loading}
            onClick={submitHandler}
          >
            {t("verify_button")}
          </AQButton>
           {/* Countdown */}
          <Countdown seconds={seconds} />

          
        </div>
      </DialogContent>
    </Dialog>
  );
}
