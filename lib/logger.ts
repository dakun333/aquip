// lib/logger.ts
// 使用 chalk 封装的日志工具，包含颜色和时间戳
import chalk from "chalk";

const isDev = process.env.NODE_ENV === "development";

/**
 * 获取格式化的当前时间
 * 格式: YYYY-MM-DD HH:mm:ss
 */
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化日志前缀
 */
function formatPrefix(level: string, color: (text: string) => string): string {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const levelTag = color(`[${level}]`);
  return `${timestamp} ${levelTag}`;
}

export const logger = {
  /**
   * 信息日志 - 青色
   */
  info: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("INFO", chalk.cyan);
    console.log(`${prefix} ${msg}`, ...args);
  },

  /**
   * 成功日志 - 绿色
   */
  success: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("SUCCESS", chalk.green);
    console.log(`${prefix} ${chalk.green(msg)}`, ...args);
  },

  /**
   * 警告日志 - 黄色
   */
  warn: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("WARN", chalk.yellow);
    console.warn(`${prefix} ${chalk.yellow(msg)}`, ...args);
  },

  /**
   * 错误日志 - 红色
   */
  error: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("ERROR", chalk.red);
    console.error(`${prefix} ${chalk.red(msg)}`, ...args);
  },

  /**
   * 调试日志 - 蓝色 (仅在开发环境显示)
   */
  debug: (msg: string, ...args: any[]) => {
    if (!isDev) return;
    const prefix = formatPrefix("DEBUG", chalk.blue);
    console.log(`${prefix} ${chalk.blue(msg)}`, ...args);
  },

  /**
   * 详细日志 - 洋红色 (仅在开发环境显示)
   */
  verbose: (msg: string, ...args: any[]) => {
    if (!isDev) return;
    const prefix = formatPrefix("VERBOSE", chalk.magenta);
    console.log(`${prefix} ${chalk.magenta(msg)}`, ...args);
  },

  /**
   * HTTP 请求日志 - 白色
   */
  http: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("HTTP", chalk.white);
    console.log(`${prefix} ${msg}`, ...args);
  },

  /**
   * 数据库日志 - 品红色
   */
  db: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("DB", chalk.magentaBright);
    console.log(`${prefix} ${msg}`, ...args);
  },

  /**
   * 认证日志 - 青绿色
   */
  auth: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("AUTH", chalk.cyanBright);
    console.log(`${prefix} ${msg}`, ...args);
  },

  /**
   * API 日志 - 蓝绿色
   */
  api: (msg: string, ...args: any[]) => {
    const prefix = formatPrefix("API", chalk.blueBright);
    console.log(`${prefix} ${msg}`, ...args);
  },
};
