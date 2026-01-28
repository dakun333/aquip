"use client";

import { Headset } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { AQButton } from "../ui/button";
import AmountSelect from "../ui/checkout/amount-select";
import CryptoPayment from "../ui/checkout/crypto-payment";
import PaymentModule from "../ui/checkout/payment-module";
import { PayAllocate } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { getUserId } from "../utils/format";
import { AMOUNT_CONFIG } from "../utils/constant";

export default function CheckoutPage() {
  const t = useTranslations("api");
  const tc = useTranslations("checkout");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(100);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<"card" | "crypto">("card");

  const payHandle = async (targetStep: "card" | "crypto") => {
    if (!amount || amount < AMOUNT_CONFIG.min || amount > AMOUNT_CONFIG.max) {
      toast.error(tc("invalid_amount") || "Invalid Amount");
      return;
    }

    setStep(targetStep);
    const id = getUserId().toString();

    try {
      setLoading(true);
      const response = await PayAllocate({
        provider: "YooMoney",
        amount: amount,
        currency: "RUB",
        user_id: id,
        payment_id: id,
      });
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
  };

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
