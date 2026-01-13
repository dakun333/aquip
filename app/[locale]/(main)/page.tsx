"use client";

import { Headset } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { AQButton } from "../ui/button";
import AmountSelect from "../ui/checkout/amount-select";
import CardPayment from "../ui/checkout/card-payment";
import CryptoPayment from "../ui/checkout/crypto-payment";
import VerifyCodeDialog from "../ui/checkout/verify-code";
import Link from "next/link";
import { PayAllocate } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { getUserId } from "../utils/format";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || 1;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"amount" | "card" | "crypto">("amount");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  if (!id) {
    notFound();
  }

  const submitHandle = () => {
    setLoading(true);
    setOpen(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const verifyHandle = () => {
    setStep("amount");
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
        setStep("card");
      } else {
        logger.error("payHandle response:", response.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col h-full mx-2">
        <div className="flex-1 overflow-y-auto ">
          <div className="flex flex-col justify-center items-center p-2 ">
            {step === "amount" ? (
              <AmountSelect
                amount={amount}
                onAmountChange={setAmount}
                onCardPay={payHandle}
                onCryptoPay={() => setStep("crypto")}
                loading={loading}
              />
            ) : step === "card" ? (
              <CardPayment
                amount={amount}
                onModifyAmount={() => setStep("amount")}
                onSubmit={submitHandle}
                paymentId={paymentId || ""}
              />
            ) : (
              <CryptoPayment
                amount={amount}
                onModifyAmount={() => setStep("amount")}
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
          orderId={orderId || ""}
          open={open}
          onOpenChange={setOpen}
          phone="+1 234 **** 89"
          onSubmit={verifyHandle}
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
