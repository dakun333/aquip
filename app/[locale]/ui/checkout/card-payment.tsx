"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { ICard, IPayCardInfo } from "@/app/types/checkout.type";
import { AQButton } from "../button";
import { formatMoney } from "../../utils/format";
import VirtualCard from "./card";
import PaymentForm, { PaymentFormRef } from "./form";
import CardBagDialog from "./card-bag";
import { PayVerify } from "@/lib/fetch";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { DEFAULT_CURRENCY } from "../../utils/constant";
interface IProps {
  amount: number | undefined;
  orderId?: string;
  onModifyAmount: () => void;
  onSubmit: () => void;
}

export default function CardPayment({
  amount,
  orderId,
  onModifyAmount,
  onSubmit,
}: IProps) {
  const t = useTranslations("checkout");
  const id = orderId;
  const STORAGE_KEY = "card_payment_info";

  // 从 sessionStorage 读取保存的数据
  const getStoredCardInfo = (): IPayCardInfo | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as IPayCardInfo;
      }
    } catch (error) {
      console.error("Failed to read from sessionStorage:", error);
    }
    return null;
  };

  // 保存数据到 sessionStorage
  const saveCardInfo = (info: IPayCardInfo) => {
    if (typeof window === "undefined") return;
    try {
      // 只有当所有字段都有值时才保存
      if (info.name && info.id && info.expireDate && info.cvv) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
      }
    } catch (error) {
      console.error("Failed to save to sessionStorage:", error);
    }
  };

  // 初始化时从 sessionStorage 读取数据
  const getInitialCardInfo = (): IPayCardInfo => {
    const storedInfo = getStoredCardInfo();
    return (
      storedInfo || {
        name: "",
        id: "",
        expireDate: "",
        cvv: "",
      }
    );
  };

  const [cardInfo, setCardInfo] = useState<IPayCardInfo>(getInitialCardInfo);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const formRef = useRef<PaymentFormRef>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 组件挂载后，如果有保存的数据，触发表单验证
  useEffect(() => {
    const storedInfo = getStoredCardInfo();
    if (storedInfo && formRef.current) {
      // 延迟执行，确保表单已经渲染完成
      const timer = setTimeout(() => {
        if (formRef.current) {
          // setValue 会自动触发验证
          formRef.current.setValue(storedInfo);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const validChange = (v: boolean) => {
    console.log("validChange:", v);
    setIsValid(v);
  };

  const formChange = (v: IPayCardInfo) => {
    setCardInfo(v);
    // 保存到 sessionStorage
    saveCardInfo(v);
  };

  const selectCardHandle = (item: ICard) => {
    formRef.current?.setValue(item);
    setOpen(false);
  };
  const submitHandle = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const params = {
        order_id: id || "",
        payer_information: {
          via_card_number: cardInfo.id.replace(/\s/g, ""),
          expiry_month: cardInfo.expireDate.split("/")[0],
          expiry_year: cardInfo.expireDate.split("/")[1],
          security_code: cardInfo.cvv,
        },
      };
      const response = await PayVerify(params);
      if (response.success) {
        logger.info("PayVerify response success:", response);
        onSubmit();
      } else {
        logger.error("PayVerify response:", response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      {/* <div className="w-full flex justify-end my-2">
        <AQButton
          // variant="link"
          size="sm"
          loading={loading}
          onClick={() => setOpen(true)}
        >
          {t("select_card")}
        </AQButton>
      </div> */}
      <div className="w-full pt-4 border-t border-gray-200 mx-2">
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-medium">{t("total")}</span>
          <span className="text-2xl font-bold">{formatMoney(amount)}</span>
        </div>

        <AQButton
          disabled={!isValid || loading}
          loading={loading}
          className="w-full h-12 text-lg"
          onClick={submitHandle}
        >
          {t("pay_amount", {
            amount: formatMoney(amount),
          })}
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
