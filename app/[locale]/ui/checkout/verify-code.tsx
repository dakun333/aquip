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
import { useSearchParams } from "next/navigation";

interface VerifyCodeDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  phone: string;
  seconds?: number; // 默认倒计时秒数
  onSubmit?: () => void;
}

export default function VerifyCodeDialog({
  open,
  onOpenChange,
  phone,
  seconds = 60,
  onSubmit,
}: VerifyCodeDialogProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
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
    if (code.length !== 4 || !id) return;
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
      <DialogContent className="rounded-xl w-[340px]  flex flex-col items-center gap-2 aspect-48/56">
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
