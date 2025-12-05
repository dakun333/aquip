interface Config {
  unit?: string;
  position?: "left" | "right";
  decimal?: number;
}

const defaultConfig = { unit: "￥", decimal: 2, position: "left" };

/**
 * 金额格式化
 * @param money 金额数值或字符串
 * @returns 格式化后的金额字符串
 */
export function formatMoney(money: number | string, config?: Config): string {
  // 仅进行一次对象合并。
  // 合并后的 mergedConfig 保证所有属性都来自 defaultConfig 或 config。
  const mergedConfig = { ...defaultConfig, ...config };

  // 直接从合并后的对象中解构，无需再设置默认值
  const { unit, decimal, position } = mergedConfig;

  // TypeScript 提示：这里的 decimal 已经是 number 类型 (2) 或用户传入的值

  // 确保 decimal 是非负整数
  const finalDecimal = Math.max(
    0,
    Math.floor(decimal ?? defaultConfig.decimal)
  );

  // 处理 undefined 或 null 的情况
  if (money === null || money === undefined) {
    return `${unit}0.${"0".repeat(finalDecimal)}`;
  }

  // ... (其余代码保持不变) ...

  // 类型转换和清理
  let numValue: number;
  if (typeof money === "string") {
    // 去除空格并尝试转换
    const trimmed = money.trim();
    if (trimmed === "") {
      return `${unit}0.${"0".repeat(finalDecimal)}`;
    }
    // 注意：parseFloat 会忽略非数字字符，这可能不是期望的行为，但保留您的逻辑。
    numValue = parseFloat(trimmed);
  } else {
    numValue = money;
  }

  // 处理 NaN 和 Infinity
  if (!isFinite(numValue)) {
    return `${unit}0.${"0".repeat(finalDecimal)}`;
  }

  // 格式化为指定小数位数的字符串
  // 注意：这里使用 finalDecimal
  const formattedNumber = numValue.toFixed(finalDecimal);

  // 添加货币符号，并根据 position 决定其位置
  if (position === "left") {
    return `${unit}${formattedNumber}`;
  } else {
    return `${formattedNumber}${unit}`;
  }
}
