"use client";

import { Headset } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { AMOUNT_CONFIG } from "../utils/constant";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("api");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [payRolling, setPayRolling] = useState<boolean>(false);

  const [step, setStep] = useState<"amount" | "card" | "crypto">("amount");

  const searchParams = useSearchParams();

  useEffect(() => {
    const amountParam = searchParams.get("amount");
    if (amountParam && step === "amount" && !orderId && amount === undefined) {
      const val = parseInt(amountParam);
      if (val >= AMOUNT_CONFIG.min && val <= AMOUNT_CONFIG.max) {
        logger.info("amountParam:", val);
        setAmount(val);
        payHandle(val);
      }
    }
  }, [searchParams, step, orderId, amount]);

  const submitHandle = () => {
    setLoading(true);
    setOpen(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const verifyHandle = () => {
    logger.info("verifyHandle");
    setPayRolling(true);
    // router.push(`/`);
  };
  const payHandle = async (val?: number) => {
    const targetAmount = val || amount;
    if (
      !targetAmount ||
      targetAmount < AMOUNT_CONFIG.min ||
      targetAmount > AMOUNT_CONFIG.max
    ) {
      logger.error("amount is invalid");
      return;
    }
    const id = getUserId().toString();
    try {
      setLoading(true);
      const response = await PayAllocate({
        provider: "YooMoney",
        amount: targetAmount,
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
        toast.error(t("end_error"));
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
            {step === "amount" || !orderId ? (
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
                orderId={orderId}
                onModifyAmount={() => {
                  setStep("amount");
                  setOrderId(undefined);
                }}
                onSubmit={submitHandle}
              />
            ) : (
              <CryptoPayment
                amount={amount}
                onModifyAmount={() => {
                  setStep("amount");
                  setOrderId(undefined);
                }}
                onSubmit={submitHandle}
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
        <VerifyCodeDialog
          open={open}
          onOpenChange={setOpen}
          phone="+1 234 **** 89"
          orderId={orderId}
          onSubmit={verifyHandle}
        />
        <PaymentOverlay
          open={payRolling}
          orderId={orderId}
          onComplete={() => {
            setPayRolling(false);
            setStep("amount");
            setOrderId(undefined);
            // 支付完成后的处理，显示成功提示并跳转
            // toast.success(t("completed") || "支付成功");
          }}
          onError={() => {
            setPayRolling(false);
            setStep("amount");
            setOrderId(undefined);
            // 显示失败提示
            // toast.error(t("failed") || "支付失败，请重试");
          }}
        />
      </div>
    </>
  );
}
