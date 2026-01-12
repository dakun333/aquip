export interface CurrencyUnit {
  fullName: string; // 全称
  sign: string; // 简写符号
  value: string; // 值
}

export const UNIT = [
  {
    fullName: "RUB",
    sign: "₽",
    value: "rub",
  },
  {
    fullName: "USDT",
    sign: "$",
    value: "usdt",
  },
  {
    fullName: "RMB",
    sign: "￥",
    value: "rmb",
  },
] as const satisfies readonly CurrencyUnit[];

export const DEFAULT_CURRENCY = UNIT[0];
// 从 UNIT 列表中推断出所有的 value 值类型
export type CurrencyValue = (typeof UNIT)[number]["value"];
