"use client";

import { Lock, Copy, Check, Info, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { AQButton } from "../button";
import { formatMoney } from "../../utils/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tokens } from "@/app/data/crypto.data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


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
  const [selectedTokenId, setSelectedTokenId] = useState<string>(tokens[0].id);
  const [selectedChainId, setSelectedChainId] = useState<string>(
    tokens[0].chains[0].id
  );
  const [copied, setCopied] = useState(false);

  const selectedToken = useMemo(
    () => tokens.find((t) => t.id === selectedTokenId),
    [selectedTokenId]
  );

  const selectedChain = useMemo(
    () => selectedToken?.chains.find((c) => c.id === selectedChainId),
    [selectedToken, selectedChainId]
  );

  const handleTokenChange = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    const token = tokens.find((t) => t.id === tokenId);
    if (token && token.chains.length > 0) {
      setSelectedChainId(token.chains[0].id);
    }
  };

  const handleCopy = async () => {
    if (!selectedChain) return;

    try {
      await navigator.clipboard.writeText(selectedChain.walletAddress);
      setCopied(true);
      toast.success(t("address_copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("copy_failed"));
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 py-4">
        {/* 选择币种和链 */}
        <div className="grid grid-cols-2 gap-4 ">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              {t("supported_token")}
            </div>
            <Select value={selectedTokenId} onValueChange={handleTokenChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom">
                {tokens.map((token) => (
                  <SelectItem key={token.id} value={token.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {token.name[0]}
                      </div>
                      {token.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 flex justify-between ">
              {t("supported_chain")}
              <div className="flex items-center text-xs text-gray-400 gap-1">
                {t("min_deposit", { amount: "$10" })} <Info className="w-3 h-3" />
              </div>
            </div>

            <Select value={selectedChainId} onValueChange={setSelectedChainId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom">
                {selectedToken?.chains.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {chain.name[0]}
                      </div>
                      {chain.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 二维码区域 */}
        <div className="flex flex-col items-center justify-center  ">
          <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
            <QRCodeCanvas
              value={selectedChain?.walletAddress || ""}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* 地址显示区域 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">
                {t("deposit_address")}
              </span>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
            <button className="text-xs text-primary hover:underline font-medium">
              {t("terms_apply")}
            </button>
          </div>

          <div className="relative group">
            <div className="w-full p-3 pr-12 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs break-all leading-relaxed text-gray-600">
              {selectedChain?.walletAddress}
            </div>
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
              title={t("copy_address")}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors mt-2"
          >
            <Copy className="w-4 h-4" />
            {t("copy_address")}
          </button>
        </div>

        {/* 详情折叠区域 */}
        <Collapsible className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors group select-none">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">$</span>
                </div>
                <span className="text-sm text-gray-600">
                  {t("price_impact")}:{" "}
                  <span className="font-semibold text-gray-900">0.00%</span>
                </span>
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-gray-50/30 px-4 pb-4 space-y-3 ">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 rounded-full bg-gray-200/50 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-500">%</span>
                </div>
                {t("max_slippage")}
              </div>
              <div className="flex items-center gap-1 font-medium text-gray-700">
                {t("auto")} • 0.05% <Info className="w-3 h-3 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 rounded-full bg-gray-200/50 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-500">⏱</span>
                </div>
                {t("processing_time")}
              </div>
              <div className="font-medium text-gray-700">
                {t("less_than_min", { min: 1 })}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 rounded-full bg-gray-200/50 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-500">?</span>
                </div>
                {t("have_questions")}
              </div>
              <button className="text-primary font-medium hover:underline">
                {t("get_help")}
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="w-full mt-10 pt-4 border-t border-gray-200 mx-2">
        <div className="flex justify-between items-center ">
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
