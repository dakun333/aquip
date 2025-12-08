"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { use, useState } from "react";
import Image from "next/image";
import { AQButton } from "../button";
import Countdown from "./count-down";
export default function VerifyCode() {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitCodeHandler = async () => {
    setLoading(true);
    try {
      const res = true;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex  items-center justify-center">
      <div className="w-[80%] max-w-md px-2 py-4 flex flex-col items-center justify-center gap-1.5 bg-white rounded-md text-center">
        <Image src="/safe.svg" alt="safe.svg" width={64} height={64}></Image>
        <div className="font-bold text-xl">Verify Code</div>
        <div className="text-xs text-[#6B7280]">
          Please enter the 4-digit code sent to
        </div>
        <div className="text-xs text-[#6B7280]">+1 234 **** 89</div>
        <div className="my-2">
          <InputOTP maxLength={4} value={code} onChange={(v) => setCode(v)}>
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
        <div className="text-[#2563EB] text-xs">
          Resend code in <Countdown seconds={180} />
        </div>
        <AQButton
          className="bg-[#2563EB] w-[80%]  my-2"
          disabled={code.length != 4}
          onClick={submitCodeHandler}
          loading={loading}
        >
          Verify
        </AQButton>
        <div className="text-xs text-[#6B7280] cursor-pointer">
          Change phone number?
        </div>
      </div>
    </div>
  );
}
