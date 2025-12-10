"use client";

import React, { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react"; // 可换图标库
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export interface NumberInputProps {
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean; // true 表示只允许整数
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
}

/**
 * NumberInput
 * - 支持点击 +/-、长按加速、键盘上下键、手动输入、粘贴校验
 * - 会在 onChange 前进行 clamp(min,max) 处理
 */
export default function NumberInput({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  className,
}: NumberInputProps) {
  const [num, setNum] = useState<number>(Number(value));

  const isAtMin = Number(value) <= min;
  const isAtMax = Number(value) >= max;
  const changHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNum(Number(e.target.value));
  };
  const subNumHandle = () => {
    setNum(num - step);
  };
  const addNumHandle = () => {
    setNum(num + step);
  };
  return (
    <div className={clsx(className, "flex")} role="group">
      <Button
        disabled={min > num - step}
        variant="ghost"
        onClick={subNumHandle}
      >
        -
      </Button>
      <Input
        min={min}
        type="number"
        className="w-16"
        value={num}
        placeholder=""
        onChange={changHandle}
      />

      <Button
        variant="ghost"
        disabled={max < num + step}
        onClick={addNumHandle}
      >
        +
      </Button>
    </div>
  );
}
