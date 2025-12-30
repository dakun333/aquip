"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { AQButton } from "../button";
import { useTranslations } from "next-intl";
import { formatMoney } from "../../utils/format";
import clsx from "clsx";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface IProps {
  onChange: (amount: number) => void;
  value: number | undefined;
}
export default function Amount({ onChange, value }: IProps) {
  const t = useTranslations("checkout");
  const list = [100, 200, 500, 1000, 2000, 5000, 10000];
  const hot = list[2];
  const [amount, setAmount] = useState<number>(value || list[0]);

  const amountChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  useEffect(() => {
    onChange(amount);
  }, [amount]);
  return (
    <div className="w-full mt-5 md:mt-[20%]">
      <Label htmlFor="amount" className="mb-4 text-lg md:text-lg">
        {t("enter_amount")}
      </Label>
      <InputGroup className="w-full hide-arrow border-2 h-16 text-2xl md:text-3xl">
        <InputGroupAddon>
          <span>RMB</span>
        </InputGroupAddon>
        <InputGroupInput
          id="amount"
          min="0"
          step={0.1}
          type="number"
          value={amount}
          placeholder=""
          onChange={amountChangeHandle}
        />
      </InputGroup>
      <div className="grid grid-cols-3   gap-2 mt-4 text-lg ">
        {list.map((item) => (
          <AQButton
            className="h-12 text-lg md:text-lg relative"
            variant={amount === item ? "default" : "outline"}
            key={item}
            onClick={() => setAmount(item)}
          >
            {formatMoney(item)}
            {hot === item && (
              <Badge className="" variant="destructive">
                {hot === item ? "hot" : ""}
              </Badge>
            )}
          </AQButton>
        ))}
      </div>
    </div>
  );
}
