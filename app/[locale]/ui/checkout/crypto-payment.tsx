"use client";

import { Lock, Copy, Check } from "lucide-react";
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
import { toast } from "sonner";

type CryptoType = "BTC" | "ETH" | "USDT";

interface CryptoOption {
  type: CryptoType;
  name: string;
  nameZh: string;
  walletAddress: string;
  chain: string;
  chainZh: string;
  recommended?: boolean;
}

const cryptoOptions: CryptoOption[] = [
  {
    type: "BTC",
    name: "Bitcoin (BTC)",
    nameZh: "比特币",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    chain: "Bitcoin Mainnet",
    chainZh: "比特币主网",
    recommended: true,
  },
  {
    type: "ETH",
    name: "Ethereum (ETH)",
    nameZh: "以太坊",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chain: "Ethereum Mainnet",
    chainZh: "以太坊主网",
  },
  {
    type: "USDT",
    name: "USDT",
    nameZh: "泰达币",
    walletAddress: "TQn9Y2khEsLMWDm3YF8Kj7vK8K8K8K8K8K8",
    chain: "TRC-20",
    chainZh: "TRC-20",
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
  const [copied, setCopied] = useState(false);

  const selectedOption = cryptoOptions.find(
    (option) => option.type === selectedCrypto
  );

  const handleCopy = async () => {
    if (!selectedOption) return;

    try {
      await navigator.clipboard.writeText(selectedOption.walletAddress);
      setCopied(true);
      toast.success(t("address_copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("copy_failed"));
    }
  };

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

        {/* 钱包地址显示区域 */}
        {selectedOption && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {t("wallet_address")}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {selectedOption.chainZh} ({selectedOption.chain})
                </span>
              </div>
              <AQButton
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-3"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    {t("address_copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    {t("copy_address")}
                  </>
                )}
              </AQButton>
            </div>
            <div className="break-all text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">
              {selectedOption.walletAddress}
            </div>
          </div>
        )}
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
