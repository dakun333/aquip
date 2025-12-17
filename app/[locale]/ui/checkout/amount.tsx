"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AQButton } from "../button";
import { useTranslations } from "next-intl";
import { formatMoney } from "../../utils/format";
import clsx from "clsx";

interface IProps {
  onChange: (amount: number) => void;
  value: number | undefined;
}
export default function Amount({ onChange, value }: IProps) {
  const t = useTranslations("checkout");
  const list = [100, 200, 500, 1000, 2000, 5000, 10000];
  const [amount, setAmount] = useState<number>(value || list[0]);

  const amountChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };
  const submitHandle = () => {
    onChange(amount);
  };
  return (
    <div className="w-full  mt-[20%]">
      <Label htmlFor="amount" className="mb-4">
        {t("enter_amount")}
      </Label>
      <Input
        id="amount"
        min="0"
        step={0.1}
        type="number"
        value={amount}
        className="w-full hide-arrow border-2 h-12"
        placeholder=""
        onChange={amountChangeHandle}
      />
      <div className="grid grid-cols-3 gap-2 mt-4">
        {list.map((item) => (
          <AQButton
            variant={amount === item ? "default" : "outline"}
            key={item}
            onClick={() => setAmount(item)}
          >
            {formatMoney(item)}
          </AQButton>
        ))}
      </div>
      <AQButton
        disabled={amount == undefined || amount <= 0}
        className="w-full h-12 text-lg mt-8"
        onClick={submitHandle}
      >
        {t("submit_amount", { amount: formatMoney(amount) })}
      </AQButton>
    </div>
  );
}
