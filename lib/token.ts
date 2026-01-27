import "server-only";
import { logger } from "./logger";

interface GlobalToken {
  value: string;
  expiresAt: number; // 时间戳 (ms)
}

// 这里的全局变量可以确保在 Next.js 开发环境下热更新时不会丢失
const globalRef = global as unknown as { _serviceToken?: GlobalToken };
let refreshPromise: Promise<string> | null = null;

// 时间配置
const BUFFER_TIME = 20 * 60 * 1000; // 提前5分钟刷新，防止临界点失效
// 格式为 username:password
const authString = `aquipay:1234`;

// 转换为 Base64
const encodedAuth = Buffer.from(authString).toString("base64");
/**
 * 刷新 Token 的内部函数
 */
async function refreshToken(): Promise<string> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/user/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedAuth}`,
      },

      cache: "no-store", // 确保请求不被 Next.js 缓存
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  logger.info("刷新的结果:", data);

  // 假设返回结构：{ access_token: "...", expires_in: 86400 }
  globalRef._serviceToken = {
    value: data.token,

    expiresAt: Date.now() + 23.5 * 60 * 60 * 1000,
  };

  // logger.success("成功获取新全局 Token");
  return globalRef._serviceToken.value;
}

export async function getGlobalServiceToken() {
  const now = Date.now();
  const token = globalRef._serviceToken;
  // logger.info("Token 状态:", token);
  // 1. Token 不存在，必须等待刷新
  if (!token) {
    if (refreshPromise) {
      logger.info("等待正在进行的 Token 刷新...");
      return refreshPromise;
    }

    logger.info("Token 不存在，正在刷新...", process.env.NEXT_PUBLIC_API_URL);
    refreshPromise = (async () => {
      try {
        return await refreshToken();
      } catch (error) {
        logger.error("刷新全局 Token 失败:", error);

        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  const expiresAt = token.expiresAt;
  const softExpireAt = expiresAt + BUFFER_TIME; // 软过期时间点

  // 2. Token 未过期（在过期时间之前），直接返回
  if (expiresAt > now) {
    // logger.info("Token 未过期，直接返回");
    // 如果快过期了（在 bufferTime 内），后台刷新但不等待
    if (expiresAt <= now + BUFFER_TIME && !refreshPromise) {
      logger.info("Token 即将到期，后台刷新中...");
      const oldTokenValue = token.value; // 保存旧 token 值
      refreshPromise = (async () => {
        try {
          return await refreshToken();
        } catch (error) {
          logger.error("后台刷新 Token 失败:", error);
          // 后台刷新失败不影响当前请求，返回旧 token
          return oldTokenValue;
        } finally {
          refreshPromise = null;
        }
      })();
      // 不等待，直接返回旧 token
    }
    return token.value;
  }

  // 3. Token 已过期但在软过期时间内（软过期），直接返回旧 token，后台刷新
  if (now <= softExpireAt) {
    logger.info("Token 已软过期，使用旧 token，后台刷新中...");

    // 如果已有刷新请求，不等待直接返回旧 token
    if (refreshPromise) {
      return token.value;
    }

    // 启动后台刷新
    const oldTokenValue = token.value; // 保存旧 token 值
    refreshPromise = (async () => {
      try {
        return await refreshToken();
      } catch (error) {
        logger.error("后台刷新 Token 失败:", error);
        // 后台刷新失败不影响当前请求，返回旧 token
        return oldTokenValue;
      } finally {
        refreshPromise = null;
      }
    })();

    // 不等待刷新完成，直接返回旧 token
    return token.value;
  }

  // 4. Token 已硬过期，必须等待刷新完成
  if (now > softExpireAt) {
    if (refreshPromise) {
      logger.info("Token 已硬过期，等待正在进行的刷新...");
      return refreshPromise;
    }

    logger.info("Token 已硬过期，正在刷新...");
    refreshPromise = (async () => {
      try {
        return await refreshToken();
      } catch (error) {
        logger.error("刷新全局 Token 失败:", error);
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  // 5. 在软过期和硬过期之间（理论上不会到这里，但作为保险）
  logger.warn("Token 状态异常，强制刷新...");
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      return await refreshToken();
    } catch (error) {
      logger.error("刷新全局 Token 失败:", error);
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
