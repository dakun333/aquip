"use client";

import { useTranslations } from "next-intl";
import { OrderDetail } from "../../../utils/mock-api";
import PaymentModule from "../../../ui/checkout/payment-module";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderDetailClientProps {
  order: OrderDetail;
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState(order);

  const handleModifyAmount = () => {
    // 逻辑根据需求定，这里可以跳转回首页或允许修改
    router.push("/");
  };

  const handleSuccess = () => {
    // 支付成功后可以刷新状态或跳转
    setCurrentOrder({ ...currentOrder, status: "paid" });
  };

  const renderContent = () => {
    switch (currentOrder.status) {
      case "paid":
        return (
          <div className="text-center p-8 bg-green-50 rounded-xl border border-dashed border-green-300">
            <p className="text-xl font-medium text-green-600">
              {t("order_paid")}
            </p>
          </div>
        );
      case "finished":
        return (
          <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-xl font-medium text-gray-400">
              {t("order_finished")}
            </p>
          </div>
        );
      case "pending":
        return (
          <PaymentModule
            amount={currentOrder.amount}
            orderId={currentOrder.id}
            onModifyAmount={handleModifyAmount}
            onSuccess={handleSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[400px]">
      <div className="w-full max-w-md">{renderContent()}</div>
    </div>
  );
}
