"use client";

import { useTranslations } from "next-intl";
import {
  FormTable,
  FormTableColumn,
} from "@/app/[locale]/ui/admin/table/formTable";
import { Copy } from "lucide-react";
import { AQButton } from "@/app/[locale]/ui/button";
import { CopyButton } from "@/app/[locale]/ui/admin/copy";

interface OrderItem {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function OrderPage() {
  const t = useTranslations("admin_order");

  const columns: FormTableColumn<OrderItem>[] = [
    {
      title: t("order_id"),
      dataIndex: "orderId",
      key: "orderId",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {value}
          <CopyButton value={value} />
        </div>
      ),
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      hideInSearch: true,
      render: (value: number) => `￥${value.toFixed(2)}`,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      valueType: "select",
      valueEnum: {
        pending: { text: t("status_enum.pending") },
        processing: { text: t("status_enum.processing") },
        completed: { text: t("status_enum.completed") },
        failed: { text: t("status_enum.failed") },
      },
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "date",
    },
  ];

  const handleRequest = async (params: any) => {
    console.log("Fetching orders with params:", params);
    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: OrderItem[] = [
      {
        id: "1",
        orderId: "ORD001",
        amount: 100.0,
        status: "completed",
        createdAt: "2024-03-20",
      },
      {
        id: "2",
        orderId: "ORD002",
        amount: 250.5,
        status: "pending",
        createdAt: "2024-03-21",
      },
      {
        id: "3",
        orderId: "ORD003",
        amount: 50.0,
        status: "failed",
        createdAt: "2024-03-22",
      },
    ];

    // 简单的本地过滤模拟
    const filteredData = mockData.filter((item) => {
      let match = true;
      if (params.orderId && !item.orderId.includes(params.orderId))
        match = false;
      if (params.status && item.status !== params.status) match = false;
      if (params.createdAt && item.createdAt !== params.createdAt)
        match = false;
      return match;
    });

    return {
      data: filteredData,
      total: filteredData.length,
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <FormTable columns={columns} request={handleRequest} rowKey="id" />
    </div>
  );
}
