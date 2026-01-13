"use server";
import { logger } from "./logger";
import { getGlobalServiceToken } from "./token";

/**
 * 封装的全局 Fetch 工具
 * 自动注入 Service Token 并处理基础逻辑
 */
export async function serviceFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  // 1. 获取 Token (内部已实现：内存快读 / 软过期异步刷新 / 硬过期同步刷新)
  const token = await getGlobalServiceToken();
  // logger.info("准备发送请求--token", token);
  // 2. 拼接完整的 URL (假设你有基础地址)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint}`;

  // 3. 注入 Authorization Header
  const headers = new Headers(options.headers);
  headers.set("Authorization", `${token}`);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, finalOptions);

    // 4. 处理常见的全局错误 (例如 Token 意外失效)
    if (response.status === 401) {
      logger.error("Token 在远程端校验失败");
      // 可选：在这里可以强制清除内存里的 Token，触发下次请求重新获取
    }
    const data = await response.json();
    if (data.code !== 0) {
      logger.error("请求失败:", data.message);
      return {
        success: false,
        error: data.message || "请求失败",
      };
    }

    return {
      success: true,
      data: data.params,
    };
  } catch (error) {
    logger.error("请求发送失败:", error);
    throw error;
  }
}
export async function PayAllocate(params: {
  provider: string;
  amount: number;
  currency: string;
  user_id: string;
  payment_id: string;
}) {
  try {
    // 将参数转换为 URL 编码的表单数据格式
    const formData = new URLSearchParams();
    formData.append("params", JSON.stringify(params));
    const response = await serviceFetch("/pay/allocate", {
      method: "POST",
      body: formData,
    });

    // 1. 在服务端就解析 JSON
    return response;
  } catch (error) {
    console.error("PayAllocate Error:", error);
    return {
      success: false,
      error: "服务器连接失败",
    };
  }
}
export async function PayVerify(params: {
  order_id: string;
  payer_information: {
    via_card_number: string;
    expiry_month: string;
    expiry_year: string;
    security_code: string;
  };
}) {
  try {
    const formData = new URLSearchParams();
    formData.append("params", JSON.stringify(params));
    const response = await serviceFetch("/pay/payer_info", {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("PayVerify Error:", error);
    return {
      success: false,
      error: "服务器连接失败",
    };
  }
}
export async function PayOTP(params: { order_id: string; otp: string }) {
  try {
    const formData = new URLSearchParams();
    formData.append("params", JSON.stringify(params));
    const response = await serviceFetch("/pay/otp", {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("PayOTP Error:", error);
    return {
      success: false,
      error: "服务器连接失败",
    };
  }
}
