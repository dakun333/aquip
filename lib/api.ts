import { Product } from "@/app/[lang]/types/home.type";
import { TestData } from "@/app/api/product/data.mock";
// import { headers } from "next/headers";

export async function getProducts(): Promise<Product[]> {
  return TestData;
  // 使用可靠的环境变量作为基地址
  // const baseUrl = process.env.API_BASE_URL;

  // // 检查环境变量是否存在，以避免在生产环境中崩溃
  // if (!baseUrl) {
  //   throw new Error("API_BASE_URL environment variable is not set.");
  // }

  // const apiUrl = `${baseUrl}/api/product`;

  // console.log("环境", process.env.API_BASE_URL); // 仍然可以保留此行

  // // 使用完整的绝对 URL
  // const res = await fetch(apiUrl, {
  //   cache: "no-store",
  // });

  // console.log("获取到的数据:", res);

  // if (!res.ok) {
  //   throw new Error(`Failed to fetch products: ${res.status}`);
  // }

  // const json = await res.json();
  // return json.data;
}
