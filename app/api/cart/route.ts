import { jsonResponse } from "../util";
import { MockShoppingCartData } from "./data.mock";
import { Shop } from "@/app/types/cart.type";

export async function GET() {
  return jsonResponse<Shop[]>({
    code: 0,
    data: MockShoppingCartData,
  });
}
