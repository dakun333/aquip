"use client";

import { useState } from "react";
import CardPayment from "./card-payment";
import VerifyCodeDialog from "./verify-code";
import PaymentOverlay from "./payment-overlay";
import { logger } from "@/lib/logger";

interface PaymentModuleProps {
  amount: number | undefined;
  orderId: string | undefined;
  onModifyAmount: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function PaymentModule({
  amount,
  orderId,
  onModifyAmount,
  onSuccess,
  onError,
}: PaymentModuleProps) {
  const [openVerify, setOpenVerify] = useState(false);
  const [payRolling, setPayRolling] = useState(false);

  const handleSubmit = () => {
    setOpenVerify(true);
  };

  const handleVerifySubmit = () => {
    logger.info("PaymentModule: Verification submitted");
    setPayRolling(true);
  };

  const handleComplete = () => {
    setPayRolling(false);
    onSuccess?.();
  };

  const handleError = () => {
    setPayRolling(false);
    // onError?.();
  };

  if (!orderId) return null;

  return (
    <>
      <CardPayment
        amount={amount}
        orderId={orderId}
        onModifyAmount={onModifyAmount}
        onSubmit={handleSubmit}
      />
      <VerifyCodeDialog
        open={openVerify}
        onOpenChange={setOpenVerify}
        phone="+1 234 **** 89"
        orderId={orderId}
        onSubmit={handleVerifySubmit}
      />
      <PaymentOverlay
        open={payRolling}
        orderId={orderId}
        onComplete={handleComplete}
        onError={handleError}
      />
    </>
  );
}
