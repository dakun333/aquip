"use client";

import { Headset } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { AQButton } from "../ui/button";
import AmountSelect from "../ui/checkout/amount-select";
import CardPayment from "../ui/checkout/card-payment";
import CryptoPayment from "../ui/checkout/crypto-payment";
import VerifyCodeDialog from "../ui/checkout/verify-code";
import PaymentOverlay from "../ui/checkout/payment-overlay";
import Link from "next/link";
import { PayAllocate } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { getUserId } from "../utils/format";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("checkout.payment_status");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [payRolling, setPayRolling] = useState<boolean>(false);
  
  // 使用 state 管理 step 和 id，避免 hydration 错误
  const [step, setStep] = useState<"amount" | "card" | "crypto">("amount");
  const [id, setId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 在客户端挂载后读取 searchParams，避免 hydration 错误
  useEffect(() => {
    setIsMounted(true);
    const urlId = searchParams.get("id");
    const urlStep = searchParams.get("step") || "amount";
    setId(urlId);
    setStep(urlStep as "amount" | "card" | "crypto");
  }, [searchParams]);

  const submitHandle = () => {
    setLoading(true);
    setOpen(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const verifyHandle = () => {
    setPayRolling(true);
    // router.push(`/`);
  };
  const payHandle = async () => {
    if (!amount || amount <= 0) {
      logger.error("amount is invalid");
      return;
    }
    const id = getUserId().toString();
    try {
      setLoading(true);
      const response = await PayAllocate({
        provider: "YooMoney",
        amount: amount || 0,
        currency: "RUB",
        user_id: id,
        payment_id: id,
      });
      if (response.success) {
        logger.info("payHandle response success:", response);
        setPaymentId(id);
        setOrderId(response.data.order_id);
        // setStep("card");
        router.replace(`/?step=card&id=${response.data.order_id}`);
      } else {
        logger.error("payHandle response:", response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('操作失败，请联系客服');
    } finally {
      setLoading(false);
    }
  };

  // 在客户端挂载前显示加载状态，避免 hydration 错误
  if (!isMounted) {
    return (
      <div className="relative flex flex-col h-full mx-2">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col justify-center items-center p-2">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">加载中...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-col h-full mx-2">
        <div className="flex-1 overflow-y-auto ">
          <div className="flex flex-col justify-center items-center p-2 ">
            {step === "amount" || !id ? (
              <AmountSelect
                amount={amount}
                onAmountChange={setAmount}
                onCardPay={payHandle}
                onCryptoPay={() => router.replace(`/?step=crypto&id=${id || ""}`)}
                loading={loading}
              />
            ) : step === "card" ? (
              <CardPayment
                amount={amount}
                onModifyAmount={() => router.replace(`/?step=amount`)}
                onSubmit={submitHandle}
              />
            ) : (
              <CryptoPayment
                amount={amount}
                onModifyAmount={() => router.replace(`/?step=amount`)}
                onSubmit={submitHandle}
                loading={loading}
              />
            )}
          </div>
        </div>
        <Link href="/chat" className="fixed bottom-30 right-10">
          <AQButton title="聊天" size="icon-lg">
            <Headset />
          </AQButton>
        </Link>
        <VerifyCodeDialog
          open={open}
          onOpenChange={setOpen}
          phone="+1 234 **** 89"
          onSubmit={verifyHandle}
        />
        <PaymentOverlay
          open={payRolling}
          onComplete={() => {
            setPayRolling(false);
            // 支付完成后的处理，显示成功提示并跳转
            // toast.success(t("completed") || "支付成功");
            router.replace(`/?step=amount`);
          }}
          onError={() => {
            setPayRolling(false);
            router.replace(`/?step=amount`);
            // 显示失败提示
            // toast.error(t("failed") || "支付失败，请重试");
          }}
        />
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
