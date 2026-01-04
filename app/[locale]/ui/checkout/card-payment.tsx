"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { ICard, IPayCardInfo } from "@/app/types/checkout.type";
import { AQButton } from "../button";
import { formatMoney } from "../../utils/format";
import VirtualCard from "./card";
import PaymentForm, { PaymentFormRef } from "./form";
import CardBagDialog from "./card-bag";

interface IProps {
  amount: number | undefined;
  onModifyAmount: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function CardPayment({
  amount,
  onModifyAmount,
  onSubmit,
  loading = false,
}: IProps) {
  const t = useTranslations("checkout");
  const [cardInfo, setCardInfo] = useState<IPayCardInfo>({
    name: "",
    id: "",
    expireDate: "",
    cvv: "",
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const formRef = useRef<PaymentFormRef>(null);
  const validChange = (v: boolean) => {
    console.log("validChange:", v);
    setIsValid(v);
  };

  const formChange = (v: IPayCardInfo) => {
    setCardInfo(v);
  };

  const selectCardHandle = (item: ICard) => {
    formRef.current?.setValue(item);
    setOpen(false);
  };

  return (
    <>
      <div className="w-[90%] mb-8">
        <VirtualCard cardInfo={cardInfo} />
      </div>
      <PaymentForm
        ref={formRef}
        value={cardInfo}
        onChange={formChange}
        onValidChange={validChange}
      ></PaymentForm>
      <div className="w-full flex justify-end my-2">
        <AQButton
          // variant="link"
          size="sm"
          loading={loading}
          onClick={() => setOpen(true)}
        >
          {t("select_card")}
        </AQButton>
      </div>
      <div className="w-full pt-4 border-t border-gray-200 mx-2">
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-medium">{t("total")}</span>
          <span className="text-2xl font-bold">{formatMoney(amount)}</span>
        </div>

        <AQButton
          disabled={!isValid || loading}
          loading={loading}
          className="w-full h-12 text-lg"
          onClick={onSubmit}
        >
          {t("pay_amount", { amount: formatMoney(amount) })}
        </AQButton>
        <AQButton
          loading={loading}
          className="w-full h-12 text-lg mt-4"
          onClick={onModifyAmount}
        >
          {t("modify_amount")}
        </AQButton>

        <p className="flex items-center justify-center text-xs text-gray-500 mt-3">
          <Lock className="w-3 h-3 mr-1" />
          {t("secure_payment")}
        </p>
      </div>
      <CardBagDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={selectCardHandle}
      />
    </>
  );
}
