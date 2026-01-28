"use client";

import { useTranslations } from "next-intl";
import { AQButton } from "../button";
import Amount from "./amount";
import { formatMoney } from "../../utils/format";
import { AMOUNT_CONFIG, DEFAULT_CURRENCY } from "../../utils/constant";

interface IProps {
  amount: number | undefined;
  onAmountChange: (amount: number) => void;
  onCardPay: () => void;
  onCryptoPay: () => void;
  loading?: boolean;
  minAmount?: number;
  maxAmount?: number;
  walletBalance?: number;
}

export default function AmountSelect({
  amount,
  onAmountChange,
  onCardPay,
  onCryptoPay,
  loading = false,
  minAmount,
  maxAmount,
  walletBalance = 888.36,
}: IProps) {
  const t = useTranslations("checkout");
  const amountValid =
    amount != undefined &&
    amount >= (minAmount || AMOUNT_CONFIG.min) &&
    amount <= (maxAmount || AMOUNT_CONFIG.max);

  return (
    <>
      <Amount
        onChange={onAmountChange}
        value={amount}
        minAmount={minAmount}
        maxAmount={maxAmount}
        walletBalance={walletBalance}
      />
      <AQButton
        className="w-full h-12 text-lg mt-8"
        disabled={!amountValid || loading}
        loading={loading}
        onClick={onCardPay}
      >
        {t("card_pay", {
          amount: formatMoney(amount),
        })}
      </AQButton>
      {/* 加密货币支付 */}
      <AQButton
        className="w-full h-12 text-lg mt-4"
        disabled={true}
        // disabled={!amountValid || loading}
        loading={loading}
        onClick={onCryptoPay}
      >
        {t("crypto_pay", {
          amount: formatMoney(amount, {
            unit: "usdt",
            position: "right",
            decimal: 0,
          }),
        })}
      </AQButton>
    </>
  );
}
