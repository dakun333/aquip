"use client";

import { Headset } from "lucide-react";
import { useState, Suspense, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { AQButton } from "../ui/button";
import CryptoPayment from "../ui/checkout/crypto-payment";
import PaymentModule from "../ui/checkout/payment-module";
import { PayAllocate } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { formatMoney, getUserId } from "../utils/format";
import { AMOUNT_CONFIG } from "../utils/constant";
import { AppError } from "@/lib/utils";

function CheckoutContent() {
  const t = useTranslations("api");
  const tc = useTranslations("checkout");
  const searchParams = useSearchParams();
  const urlAmount = searchParams.get("amount");
  const urlPaymentId = searchParams.get("payment_id");
  const amount_error_msg = `${tc("min_amount", {
    amount: formatMoney(AMOUNT_CONFIG.min, { decimal: 0 }),
  })} - ${tc("max_amount", {
    amount: formatMoney(AMOUNT_CONFIG.max, { decimal: 0 }),
  })}`;
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | undefined>(
    urlAmount && !isNaN(parseInt(urlAmount, 10)) ? parseInt(urlAmount, 10) : 100
  );
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<"card" | "crypto">("card");
  const [error, setError] = useState<string | null>(null);
  if (!urlPaymentId) {
    throw new AppError("No payment ID");
  }
  if (!amount || amount < AMOUNT_CONFIG.min || amount > AMOUNT_CONFIG.max) {
    throw new AppError(tc("amount_range"), amount_error_msg);
  }

  const payHandle = useCallback(
    async (targetStep: "card" | "crypto") => {
      if (!urlPaymentId) {
        return false;
      }
      if (orderId) return true;
      if (!amount || amount < AMOUNT_CONFIG.min || amount > AMOUNT_CONFIG.max) {
        throw new AppError(tc("amount_range"), amount_error_msg);
      }

      setStep(targetStep);
      // const id = getUserId().toString();
      const id = urlPaymentId;

      try {
        setLoading(true);
        setError(null);
        // 延迟 1s 以防止请求过快
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await PayAllocate({
          provider: "YooMoney",
          amount: amount,
          currency: "RUB",
          user_id: id,
          payment_id: id,
        });
        console.log("response", response);
        if (response.success) {
          setOrderId(response.data.order_id);
          return true;
        } else {
          throw new AppError(response.error);
          const msg = response.error || t("end_error");
          logger.error("payHandle response:", response.error);
          toast.error(msg);
          setError(msg);
          return false;
        }
      } catch (err: any) {
        console.error(err);
        throw err;
        const msg = err?.message || t("end_error");
        toast.error(msg);
        setError(msg);
        return false;
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
    // 进页面直接调用支付逻辑
    const initPay = async () => {
      if (!orderId && !error && amount && urlPaymentId) {
        await payHandle("card");
      }
    };
    initPay();
  }, [payHandle, orderId, error, amount, urlPaymentId]);

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
              // 正在获取 orderId 时显示加载状态
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-gray-500">Initializing payment...</p>
              </div>
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
