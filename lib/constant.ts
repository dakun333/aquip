export interface CurrencyUnit {
  fullName: string; // 全称
  sign: string; // 简写符号
  value: string; // 值
}

export const UNIT: CurrencyUnit[] = [
  {
    fullName: "Tether USD",
    sign: "USDT",
    value: "usdt",
  },
  {
    fullName: "人民币",
    sign: "RMB",
    value: "rmb",
  },
  {
    fullName: "Russian Ruble",
    sign: "RUB",
    value: "rub",
  },
];
