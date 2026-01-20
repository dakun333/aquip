"use client";

import { FormatCountdown } from "@/app/[locale]/utils/format";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export interface CountdownProps {
  seconds: number; // 初始秒数
  onFinish?: () => void; // 倒计时结束回调
  className?: string; // 自定义样式
}

export default function Countdown({
  seconds,
  onFinish,
  className,
}: CountdownProps) {
  const t = useTranslations("checkout");
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onFinish]);

  // 倒计时结束后显示"重新发送"
  if (timeLeft <= 0) {
    return (
      <span className={`text-blue-600 text-xs cursor-pointer ${className}`}>
        {t("resend_code") }
      </span>
    );
  }

  return (
    <div className={`text-blue-600 text-xs ${className}`}>
      {t("resend_prefix")} <span>{FormatCountdown(timeLeft, "mm:ss")}</span>
    </div>
  );
}
