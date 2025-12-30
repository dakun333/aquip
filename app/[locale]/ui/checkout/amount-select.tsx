"use client";

import { useTranslations } from "next-intl";
import { AQButton } from "../button";
import Amount from "./amount";
import { formatMoney } from "../../utils/format";

interface IProps {
  amount: number | undefined;
  onAmountChange: (amount: number) => void;
  onCardPay: () => void;
  onCryptoPay: () => void;
  loading?: boolean;
}

export default function AmountSelect({
  amount,
  onAmountChange,
  onCardPay,
  onCryptoPay,
  loading = false,
}: IProps) {
  const t = useTranslations("checkout");
  const amountValid = amount != undefined && amount > 0;

  return (
    <>
      <Amount onChange={onAmountChange} value={amount} />
      <AQButton
        className="w-full h-12 text-lg mt-8"
        disabled={!amountValid || loading}
        loading={loading}
        onClick={onCardPay}
      >
        {t("card_pay", { amount: formatMoney(amount) })}
      </AQButton>
      {/* 加密货币支付 */}
      <AQButton
        className="w-full h-12 text-lg mt-4"
        disabled={!amountValid || loading}
        loading={loading}
        onClick={onCryptoPay}
      >
        {t("crypto_pay", {
          amount: formatMoney(amount, {
            unit: "USDT",
            position: "right",
            decimal: 0,
          }),
        })}
      </AQButton>
    </>
  );
}
