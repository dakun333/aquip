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
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl w-[340px]  flex flex-col items-center gap-2 aspect-48/56">
        <Image src="/safe.svg" alt="safe" width={64} height={64} />

        <div className="text-center">Verify Code</div>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="text-xs text-gray-500">
            Please enter the 4-digit code sent to
          </div>
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
            Resend code in <Countdown seconds={seconds} />
          </div>

          {/* Confirm */}
          <AQButton
            className="bg-blue-600 w-[80%] mt-2"
            disabled={code.length !== 4}
            loading={loading}
            onClick={submitHandler}
          >
            Verify
          </AQButton>

          <p className="text-xs text-gray-500 cursor-pointer">
            Change phone number?
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
