"use client";

import BackHeader from "../../ui/backHeader";

import { Form, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import VirtualCard from "../../ui/checkout/card";
import PaymentForm from "../../ui/checkout/form";
import { notFound, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { IPayCardInfo } from "../../../types/checkout.type";
import { AQButton } from "../../ui/button";
import { set } from "zod";
import VerifyCode from "../../ui/checkout/verify-code";
import VerifyCodeDialog from "../../ui/checkout/verify-code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "../../utils/format";
import HomeHeader from "../../ui/home/header";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || 1;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("mount");
  const [amount, setAmount] = useState<number | undefined>(100);
  // console.log("id:", id);
  if (!id) {
    notFound();
  }
  const [cardInfo, setCardInfo] = useState<IPayCardInfo>({
    name: "张三",
    id: "1234567890",
    expireDate: "09/23",
    cvv: "123",
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const amountChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };
  const stepChangeHandle = (v: string) => {
    console.log("stepChangeHandle:", v);
    setStep(v);
  };
  const validChange = (v: boolean) => {
    console.log("validChange:", v);
    setIsValid(v);
  };
  const formChange = (v: IPayCardInfo) => {
    setCardInfo(v);
  };
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
      <div className="relative flex flex-col h-full ">
        {/* <BackHeader title="支付" /> */}
        <HomeHeader />
        <div className="flex-1 overflow-y-auto ">
          <div className="flex flex-col justify-center items-center p-2 max-w-[460px] w-[80%] mx-auto">
            {step == "mount" ? (
              <>
                <div className="w-full  mt-[20%]">
                  <Label htmlFor="amount" className="mb-4">
                    {t("enter_amount")}
                  </Label>
                  <Input
                    id="amount"
                    min="0"
                    step={0.1}
                    type="number"
                    value={amount}
                    className="w-full hide-arrow"
                    placeholder=""
                    onChange={amountChangeHandle}
                  />
                  <AQButton
                    disabled={amount == undefined || amount <= 0}
                    className="w-full h-12 text-lg mt-8"
                    onClick={() => setStep("pay")}
                  >
                    {t("submit_amount", { amount: formatMoney(amount) })}
                  </AQButton>
                </div>
              </>
            ) : (
              <>
                <div className="w-full mb-8">
                  <VirtualCard cardInfo={cardInfo} />
                </div>
                <PaymentForm
                  onChange={formChange}
                  onValidChange={validChange}
                ></PaymentForm>

                <div className="w-full mt-10 pt-4 border-t border-gray-200 mx-2">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-medium">{t("total")}</span>
                    <span className="text-2xl font-bold">
                      {formatMoney(amount)}
                    </span>
                  </div>

                  <AQButton
                    disabled={!isValid || loading}
                    loading={loading}
                    className="w-full h-12 text-lg"
                    onClick={submitHandle}
                  >
                    {t("pay_amount", { amount: formatMoney(amount) })}
                  </AQButton>
                  <AQButton
                    loading={loading}
                    className="w-full h-12 text-lg mt-4"
                    onClick={() => setStep("mount")}
                  >
                    {t("modify_amount")}
                  </AQButton>

                  <p className="flex items-center justify-center text-xs text-gray-500 mt-3">
                    <Lock className="w-3 h-3 mr-1" />
                    {t("secure_payment")}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* <VerifyCode /> */}
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
