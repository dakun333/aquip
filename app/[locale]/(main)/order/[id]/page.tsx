import { getOrderDetailMock } from "../../../utils/mock-api";
import { notFound } from "next/navigation";
import OrderDetailClient from "./order-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrderDetailMock(id);

  if (order.status === "notfound") {
    notFound();
  }

  return (
    <div className="relative flex flex-col h-full mx-2">
      <div className="flex-1 overflow-y-auto">
        <OrderDetailClient order={order} />
      </div>
    </div>
  );
}
