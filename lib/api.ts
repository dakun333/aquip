import { Product } from "@/app/types/home.type";
import { db } from "./db";

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

export async function getAllUser() {
  const data = await db`select * from users`;
  return data;
}
