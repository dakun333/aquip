"use client";
/**
 * 登录接口 必须要在use Client的文件下要不然会一直报错，因为会在SSR进行渲染
 * @param email 邮箱
 * @param password 密码
 * @returns 登录成功返回 token，登录失败返回错误信息
 */
export async function loginByEmail(email: string, password: string) {
  const resp = await fetch("/api/jwt-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await resp.json();
  if (data.code !== 0) {
    // 登录失败，抛出错误，方便上层捕获并展示提示
    throw new Error(data.message || "Login failed");
  }

  // 登录成功，返回后端返回的数据（包含 token 等）
  return data.data as { token?: string };
}
