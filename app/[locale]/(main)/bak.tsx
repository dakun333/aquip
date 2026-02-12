"use client";

import { Headset } from "lucide-react";
import { useState, Suspense, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { AQButton } from "../ui/button";
import AmountSelect from "../ui/checkout/amount-select";
import CryptoPayment from "../ui/checkout/crypto-payment";
import PaymentModule from "../ui/checkout/payment-module";
import { PayAllocate } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { getUserId } from "../utils/format";
import { AMOUNT_CONFIG } from "../utils/constant";

function CheckoutContent() {
  const t = useTranslations("api");
  const tc = useTranslations("checkout");
  const searchParams = useSearchParams();
  const urlAmount = searchParams.get("amount");
  const urlPaymentId = searchParams.get("payment_id");

  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | undefined>(
    urlAmount && !isNaN(parseInt(urlAmount, 10)) ? parseInt(urlAmount, 10) : 100
  );
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<"card" | "crypto">("card");
  const [hasAutoPaid, setHasAutoPaid] = useState(false);

  // 初始化检查：如果没有参数，则取消加载状态
  useEffect(() => {
    if (!urlPaymentId && !urlAmount) {
      setLoading(false);
    }
  }, [urlPaymentId, urlAmount]);

  const payHandle = useCallback(
    async (targetStep: "card" | "crypto") => {
      if (orderId) return;
      if (!amount || amount < AMOUNT_CONFIG.min || amount > AMOUNT_CONFIG.max) {
        toast.error(tc("invalid_amount") || "Invalid Amount");
        setLoading(false);
        return;
      }

      setStep(targetStep);
      const id = getUserId().toString();

      try {
        setLoading(true);
        // 延迟 1s 以防止请求过快
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await PayAllocate({
          provider: "YooMoney",
          amount: amount,
          currency: "RUB",
          user_id: id,
          payment_id: urlPaymentId || id,
        });
        console.log("response", response);
        if (response.success) {
          setOrderId(response.data.order_id);
        } else {
          logger.error("payHandle response:", response.error);
          toast.error(t("end_error"));
        }
      } catch (error) {
        console.error(error);
        toast.error(t("end_error"));
      } finally {
        setLoading(false);
      }
    },
    [amount, orderId, t, tc, urlPaymentId]
  );
  useEffect(() => {
    if (urlAmount) {
      const parsed = parseInt(urlAmount, 10);
      if (!isNaN(parsed)) {
        setAmount(parsed);
      }
    }
  }, [urlAmount]);

  useEffect(() => {
    // 自动支付逻辑：如果有 payment_id 且还没付过，则触发
    if (urlPaymentId && amount && !orderId && !hasAutoPaid) {
      setHasAutoPaid(true);
      payHandle("card");
    } else if (!urlPaymentId || !amount) {
      // 如果不满足自动支付条件（缺少必要参数），确保 loading 为 false
      setLoading(false);
    }
  }, [urlPaymentId, amount, orderId, hasAutoPaid, payHandle]);

  return (
    <>
      <div className="relative flex flex-col h-full mx-2">
        <div className="flex-1 overflow-y-auto ">
          <div className="flex flex-col justify-center items-center p-2 min-h-[400px]">
            {orderId ? (
              step === "card" ? (
                <PaymentModule
                  amount={amount}
                  orderId={orderId}
                  onModifyAmount={() => {
                    setOrderId(undefined);
                  }}
                  onSuccess={() => {
                    setOrderId(undefined);
                  }}
                  onError={() => {
                    setOrderId(undefined);
                  }}
                />
              ) : (
                <CryptoPayment
                  amount={amount}
                  onModifyAmount={() => {
                    setOrderId(undefined);
                  }}
                  onSubmit={() => {
                    toast.info("Crypto payment submitted");
                  }}
                  loading={loading}
                />
              )
            ) : (
              <AmountSelect
                amount={amount}
                onAmountChange={setAmount}
                onCardPay={() => payHandle("card")}
                onCryptoPay={() => payHandle("crypto")}
                loading={loading}
              />
            )}
          </div>
        </div>
        <div className="fixed bottom-30 right-10">
          <AQButton title="service" size="icon-lg">
            <Headset />
          </AQButton>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
