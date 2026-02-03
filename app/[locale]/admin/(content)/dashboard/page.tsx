"use client";

import { formatMoney } from "@/app/[locale]/utils/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
} from "recharts";

const data = [
  { name: "Apr 7", revenue: 400, orders: 240 },
  { name: "Apr 13", revenue: 300, orders: 139 },
  { name: "Apr 19", revenue: 200, orders: 980 },
  { name: "Apr 26", revenue: 278, orders: 390 },
  { name: "May 2", revenue: 189, orders: 480 },
  { name: "May 8", revenue: 239, orders: 380 },
  { name: "May 14", revenue: 349, orders: 430 },
  { name: "May 21", revenue: 450, orders: 500 },
  { name: "May 28", revenue: 520, orders: 610 },
  { name: "Jun 3", revenue: 480, orders: 550 },
  { name: "Jun 9", revenue: 600, orders: 700 },
  { name: "Jun 15", revenue: 550, orders: 680 },
  { name: "Jun 22", revenue: 700, orders: 850 },
  { name: "Jun 30", revenue: 800, orders: 950 },
];

export default function DashboardPage() {
  const t = useTranslations("admin");
  const statisitc = {
    orderCount: 100,
    orderAmount: 1000,
    successCount: 100,
    successRate: 100,
  };
  return (
    <div className="flex flex-col gap-6">
      {/* 顶部四个卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">订单数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisitc.orderCount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">订单金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMoney(statisitc.orderAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">异常订单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Total Visitors</CardTitle>
            <CardDescription>Total for the last 3 months</CardDescription>
          </div>
          <div className="flex gap-2 bg-muted p-1 rounded-md">
            <div className="px-3 py-1 text-xs font-medium bg-background rounded shadow-sm cursor-pointer">
              Last 3 months
            </div>
            <div className="px-3 py-1 text-xs font-medium text-muted-foreground cursor-pointer">
              Last 30 days
            </div>
            <div className="px-3 py-1 text-xs font-medium text-muted-foreground cursor-pointer">
              Last 7 days
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f5f5f5"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="金额 (Revenue)"
                  stroke="#8884d8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Bar
                  dataKey="orders"
                  name="订单 (Orders)"
                  fill="#413ea0"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
