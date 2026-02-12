export interface WalletRecord {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: Date;
  category?: string;
}

export const WalletTestData: WalletRecord[] = [
  {
    id: "1",
    type: "income",
    amount: 500.0,
    description: "充值",
    date: new Date("2024-01-15T10:30:00"),
    category: "充值",
  },
  {
    id: "2",
    type: "expense",
    amount: 150.0,
    description: "购买商品",
    date: new Date("2024-01-14T14:20:00"),
    category: "购物",
  },
  {
    id: "3",
    type: "income",
    amount: 1000.0,
    description: "充值",
    date: new Date("2024-01-13T09:15:00"),
    category: "充值",
  },
  {
    id: "4",
    type: "expense",
    amount: 200.0,
    description: "支付订单",
    date: new Date("2024-01-12T16:45:00"),
    category: "订单",
  },
  {
    id: "5",
    type: "expense",
    amount: 50.0,
    description: "服务费",
    date: new Date("2024-01-11T11:30:00"),
    category: "服务",
  },
  {
    id: "6",
    type: "income",
    amount: 300.0,
    description: "退款",
    date: new Date("2024-01-10T13:20:00"),
    category: "退款",
  },
  {
    id: "7",
    type: "expense",
    amount: 80.0,
    description: "购买商品",
    date: new Date("2024-01-09T15:10:00"),
    category: "购物",
  },
  {
    id: "8",
    type: "expense",
    amount: 131.64,
    description: "支付订单",
    date: new Date("2024-01-08T10:00:00"),
    category: "订单",
  },
];
