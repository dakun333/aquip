"use client";

import {
  Dialog,
  DialogContent,
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

interface VerifyCodeDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  phone: string;
  seconds?: number; // 默认倒计时秒数
  onSubmit?: (code: string) => Promise<void> | void;
}

export default function VerifyCodeDialog({
  open,
  onOpenChange,
  phone,
  seconds = 180,
  onSubmit,
}: VerifyCodeDialogProps) {
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
    if (code.length !== 4) return;
    setLoading(true);
    try {
      await onSubmit?.(code);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-xl w-[340px]  flex flex-col items-center gap-2 aspect-48/56">
        <Image src="/safe.svg" alt="safe" width={64} height={64} />
        <DialogHeader className="w-full">
          <DialogTitle className="text-center text-base font-semibold">
            {t("verify_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="text-xs text-gray-500">{t("verify_desc")}</div>
          <div className="text-xs text-gray-500 font-medium">{phone}</div>

          {/* OTP */}
          <div className="my-2">
            <InputOTP maxLength={4} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Countdown */}
          <div className="text-blue-600 text-xs">
            {t("resend_prefix")} <Countdown seconds={seconds} />
          </div>

          {/* Confirm */}
          <AQButton
            className="bg-blue-600 w-[80%] mt-2"
            disabled={code.length !== 4}
            loading={loading}
            onClick={submitHandler}
          >
            {t("verify_button")}
          </AQButton>

          <p className="text-xs text-gray-500 cursor-pointer">
            {t("change_phone")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
