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

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || 1;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"amount" | "card" | "crypto">("amount");
  const [amount, setAmount] = useState<number | undefined>(undefined);

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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
                onCardPay={() => setStep("card")}
                onCryptoPay={() => setStep("crypto")}
                loading={loading}
              />
            ) : step === "card" ? (
              <CardPayment
                amount={amount}
                onModifyAmount={() => setStep("amount")}
                onSubmit={submitHandle}
                loading={loading}
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
