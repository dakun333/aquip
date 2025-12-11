"use client";

import BackHeader from "../ui/backHeader";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

import VirtualCard from "../ui/checkout/card";
import PaymentForm from "../ui/checkout/form";
import { notFound, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { IPayCardInfo } from "../../types/checkout.type";
import { AQButton } from "../ui/button";
import { set } from "zod";
import VerifyCode from "../ui/checkout/verify-code";
import VerifyCodeDialog from "../ui/checkout/verify-code";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || 1;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log("id:", id);
  if (!id) {
    notFound();
  }
  const totalAmount = "2,490.00";
  const [cardInfo, setCardInfo] = useState<IPayCardInfo>({
    name: "张三",
    id: "1234567890",
    expireDate: "09/23",
    cvv: "123",
  });
  const [isValid, setIsValid] = useState<boolean>(false);

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
      <div className="relative flex flex-col h-full">
        <BackHeader title="支付" />

        <div className="flex-1 overflow-y-auto flex flex-col p-2">
          <div className="mb-8 mx-2 mt-2">
            <VirtualCard cardInfo={cardInfo} />
          </div>
          <PaymentForm
            onChange={formChange}
            onValidChange={validChange}
          ></PaymentForm>

          <div className="mt-10 pt-4 border-t border-gray-200 mx-2">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-medium">Total</span>
              <span className="text-2xl font-bold">${totalAmount}</span>
            </div>

            <AQButton
              disabled={!isValid || loading}
              loading={loading}
              className="w-full h-12 text-lg"
              onClick={submitHandle}
            >
              Pay ${totalAmount}
            </AQButton>

            <p className="flex items-center justify-center text-xs text-gray-500 mt-3">
              <Lock className="w-3 h-3 mr-1" />
              Encrypted & Secure Payment
            </p>
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
