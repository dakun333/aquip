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
import Link from "next/link";
import { Circle, CircleAlert, CircleAlertIcon } from "lucide-react";
import { AMOUNT_CONFIG, DEFAULT_CURRENCY, UNIT } from "../../utils/constant";

interface IProps {
  onChange: (amount: number) => void;
  value: number | undefined;
  minAmount?: number;
  maxAmount?: number;
  walletBalance?: number;
}
export default function Amount({
  onChange,
  value,
  minAmount = AMOUNT_CONFIG.min,
  maxAmount = AMOUNT_CONFIG.max,
  walletBalance,
}: IProps) {
  const t = useTranslations("checkout");
  const list = [100, 200, 500, 1000, 2000, 5000];
  const hot = list[2];
  const [amount, setAmount] = useState<number>(value || list[0]);

  const amountChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };
  const currency = UNIT.find((u) => u.value === DEFAULT_CURRENCY.value);

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
          <span>{currency?.fullName}</span>
        </InputGroupAddon>
        <InputGroupInput
          id="amount"
          min="0"
          step={1}
          type="number"
          value={amount}
          placeholder=""
          onChange={amountChangeHandle}
          className="text-xl md:text-xl"
        />
      </InputGroup>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium">
            {t("min_amount", {
              amount: formatMoney(minAmount, {
                decimal: 0,
                unit: currency?.value,
              }),
            })}
            {" - "}
            {t("max_amount", {
              amount: formatMoney(maxAmount, {
                decimal: 0,
                unit: currency?.value,
              }),
            })}
          </span>
        </div>
        {/* {walletBalance !== undefined && (
          <Link href="/wallet" className="flex items-center gap-1">
            <span className="text-xs text-gray-500">{t("wallet_balance")}</span>
            <span className="text-sm text-gray-700 font-medium">
              {t("balance", {
                amount: formatMoney(walletBalance, {
                  decimal: 0,
                  unit: currency?.value,
                }),
              })}
            </span>
            <CircleAlertIcon className="w-4 h-4" />
          </Link>
        )} */}
      </div>
      <div className="grid grid-cols-3   gap-2 mt-4 text-lg ">
        {list.map((item) => (
          <AQButton
            className="h-12 text-lg md:text-lg relative"
            variant={amount === item ? "default" : "outline"}
            key={item}
            onClick={() => setAmount(item)}
          >
            {formatMoney(item, { decimal: 0, unit: currency?.value })}
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
