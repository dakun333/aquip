import { Product } from "@/app/[locale]/types/home.type";
import { TestData } from "@/app/api/product/data.mock";
import { host } from "@/config";
// import { headers } from "next/headers";

export async function getProducts(): Promise<Product[]> {
  // return TestData;

  const apiUrl = `${host}/api/product`;

  console.log("环境 host:", host); // 仍然可以保留此行

  // 使用完整的绝对 URL
  const res = await fetch(apiUrl, {
    cache: "no-store",
  });

  console.log("获取到的数据:", res);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}
