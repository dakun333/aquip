"use client";

import { FormatCountdown } from "@/app/[locale]/utils/format";
import { useEffect, useState } from "react";

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

  return (
    <span className={className}>{FormatCountdown(timeLeft, "mm:ss")}</span>
  );
}
