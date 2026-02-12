"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "../../utils/format";
import { ArrowDown, ArrowUp, Wallet as WalletIcon } from "lucide-react";
import { WalletTestData } from "./testData";
import { cn } from "@/lib/utils";
import { AQButton } from "../../ui/button";

type FilterType = "all" | "income" | "expense";

export default function Wallet({ params }: PageProps<"/[locale]/wallet">) {
  const t = useTranslations("wallet");
  const [filterType, setFilterType] = useState<FilterType>("all");

  // 示例数据，实际应该从 API 获取
  const balance = 888.36;
  const totalIncome = 1500.0;
  const totalExpense = 611.64;
  const allRecords = WalletTestData;

  // 根据选中的类型过滤记录
  const filteredRecords =
    filterType === "all"
      ? allRecords
      : allRecords.filter((record) => record.type === filterType);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${month}-${day} ${hours}:${minutes}`;
  };

  const getCategoryLabel = (category?: string) => {
    if (!category) return "";
    const categoryMap: Record<string, string> = {
      充值: t("recharge"),
      购物: t("shopping"),
      订单: t("order"),
      服务: t("service"),
      退款: t("refund"),
    };
    return categoryMap[category] || category;
  };
  const usdBalance = balance * 0.15;

  return (
    <div className="h-full w-full flex flex-col pt-4 px-4">
      <div className="flex-1 overflow-y-auto flex flex-col items-stretch gap-4 pb-4">
        {/* 余额卡片 */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white/90">
              <WalletIcon className="w-5 h-5" />
              {t("balance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {formatMoney(balance)}
            </div>
            <div className="text-sm text-white/80">
              {formatMoney(usdBalance, {
                unit: "usdt",
                decimal: 2,
                position: "right",
              })}
            </div>
          </CardContent>
        </Card>

        {/* 收入和支出统计 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 收入卡片 */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                {t("income")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatMoney(totalIncome)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t("total_income")}
              </div>
            </CardContent>
          </Card>

          {/* 支出卡片 */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-red-600" />
                {t("expense")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatMoney(totalExpense)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t("total_expense")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 交易记录 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("records")}</CardTitle>
              {/* 类型切换按钮 */}
              <div className="flex gap-2">
                <AQButton
                  size="sm"
                  onClick={() => setFilterType("all")}
                  className={cn(
                    "transition-colors",
                    filterType === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {t("all")}
                </AQButton>
                <AQButton
                  size="sm"
                  onClick={() => setFilterType("income")}
                  className={cn(
                    "transition-colors",
                    filterType === "income"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {t("income")}
                </AQButton>
                <AQButton
                  size="sm"
                  onClick={() => setFilterType("expense")}
                  className={cn(
                    "transition-colors",
                    filterType === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {t("expense")}
                </AQButton>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 ">
            <div className="overflow-y-auto">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {t("no_records")}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {record.type === "income" ? (
                              <ArrowUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-medium text-gray-900">
                              {record.description}
                            </span>
                            {record.category && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {getCategoryLabel(record.category)}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 ml-6">
                            {formatDate(record.date)}
                          </div>
                        </div>
                        <div
                          className={`text-lg font-semibold ${
                            record.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {record.type === "income" ? "+" : "-"}
                          {formatMoney(record.amount, {
                            position: "right",
                            decimal: 0,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
