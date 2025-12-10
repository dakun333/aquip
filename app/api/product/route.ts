import { Product } from "@/app/[locale]/types/home.type";
import { jsonResponse } from "../util";
import { TestData } from "./data.mock";

export async function GET() {
  return jsonResponse<Product[]>({
    code: 0,
    data: TestData,
  });
}
