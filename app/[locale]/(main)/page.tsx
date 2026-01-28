"use client";

import { Headset } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { AQButton } from "../ui/button";
import CardPayment from "../ui/checkout/card-payment";
import CryptoPayment from "../ui/checkout/crypto-payment";
import PaymentModule from "../ui/checkout/payment-module";
import AmountSelect from "../ui/checkout/amount-select";
import Link from "next/link";
import { PayAllocate } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { getUserId } from "../utils/format";
import { AMOUNT_CONFIG } from "../utils/constant";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("api");
  const tc = useTranslations("checkout");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [isInvalid, setIsInvalid] = useState(false);

  const [step, setStep] = useState<"card" | "crypto">("card");

  const payHandle = async (val?: number, targetStep?: "card" | "crypto") => {
    const targetAmount = val || amount;
    const finalStep = targetStep || step;

    if (
      !targetAmount ||
      targetAmount < AMOUNT_CONFIG.min ||
      targetAmount > AMOUNT_CONFIG.max
    ) {
      toast.error(tc("invalid_amount") || "Invalid Amount");
      return;
    }

    const id = getUserId().toString();
    try {
      setLoading(true);
      setStep(finalStep);
      const response = await PayAllocate({
        provider: "YooMoney", // 暂时保持一致，或者根据 step 选择
        amount: targetAmount,
        currency: "RUB",
        user_id: id,
        payment_id: id,
      });
      if (response.success) {
        setPaymentId(id);
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
  };

  return (
    <>
      <div className="relative flex flex-col h-full mx-2">
        <div className="flex-1 overflow-y-auto ">
          <div className="flex flex-col justify-center items-center p-2 min-h-[400px]">
            {!orderId ? (
              <AmountSelect
                amount={amount}
                onAmountChange={setAmount}
                onCardPay={() => payHandle(amount, "card")}
                onCryptoPay={() => payHandle(amount, "crypto")}
                loading={loading}
              />
            ) : step === "card" ? (
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
