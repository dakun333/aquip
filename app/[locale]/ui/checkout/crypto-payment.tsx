"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AQButton } from "../button";
import { formatMoney } from "../../utils/format";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

type CryptoType = "BTC" | "ETH" | "USDT";

interface CryptoOption {
  type: CryptoType;
  name: string;
  nameZh: string;
  recommended?: boolean;
}

const cryptoOptions: CryptoOption[] = [
  {
    type: "BTC",
    name: "Bitcoin (BTC)",
    nameZh: "比特币",
    recommended: true,
  },
  {
    type: "ETH",
    name: "Ethereum (ETH)",
    nameZh: "以太坊",
  },
  {
    type: "USDT",
    name: "USDT",
    nameZh: "泰达币",
  },
];

interface IProps {
  amount: number | undefined;
  onModifyAmount: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function CryptoPayment({
  amount,
  onModifyAmount,
  onSubmit,
  loading = false,
}: IProps) {
  const t = useTranslations("checkout");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>("BTC");

  return (
    <>
      <div className="w-full mt-5">
        {/* 加密货币支付选项区域 */}
        <div className="space-y-4 mb-8">
          {cryptoOptions.map((option) => (
            <Item
              key={option.type}
              variant="outline"
              className={cn(
                "cursor-pointer hover:bg-accent/50 transition-colors",
                selectedCrypto === option.type &&
                  "border-primary bg-primary/5 hover:bg-gray-500/10"
              )}
              onClick={() => setSelectedCrypto(option.type)}
            >
              <ItemContent>
                <ItemTitle>{option.name}</ItemTitle>
                <ItemDescription className="flex gap-2">
                  <span>{option.nameZh}</span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>{option.recommended && <div>推荐</div>}</ItemActions>
            </Item>
          ))}
        </div>
      </div>

      <div className="w-full mt-10 pt-4 border-t border-gray-200 mx-2">
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-medium">{t("total")}</span>
          <span className="text-2xl font-bold">{formatMoney(amount)}</span>
        </div>

        <AQButton
          disabled={loading}
          loading={loading}
          className="w-full h-12 text-lg"
          onClick={onSubmit}
        >
          {t("pay_amount", { amount: formatMoney(amount) })}
        </AQButton>
        <AQButton
          loading={loading}
          className="w-full h-12 text-lg mt-4"
          onClick={onModifyAmount}
        >
          {t("modify_amount")}
        </AQButton>

        <p className="flex items-center justify-center text-xs text-gray-500 mt-3">
          <Lock className="w-3 h-3 mr-1" />
          {t("secure_payment")}
        </p>
      </div>
    </>
  );
}
