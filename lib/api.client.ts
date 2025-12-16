"use client";

import { Product } from "@/app/types/home.type";

/**
 * 登录接口（Email + Password）
 */
export async function loginByEmail(email: string, password: string) {
  const resp = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await resp.json();
  if (data.code !== 0) {
    throw new Error(data.message || "Login failed");
  }

  return data.data as { token?: string };
}

/**
 * 注册接口（Email + Password + Name）
 */
export async function registerByEmail(params: {
  email: string;
  password: string;
  name: string;
}) {
  const resp = await fetch("/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await resp.json();
  if (data.code !== 0) {
    throw new Error(data.message || "Register failed");
  }

  return data.data as { token?: string };
}

export async function getProducts(): Promise<Product[]> {
  // return TestData;

  const apiUrl = `/api/product`;

  // 使用完整的绝对 URL
  const res = await fetch(apiUrl, {
    // cache: "no-store",
  });

  console.log("商品列表:", res);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}
