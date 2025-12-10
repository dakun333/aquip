import { NextResponse } from "next/server";
import { TestData } from "../data.mock";
import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // 解析 params promise
  const params = await context.params;
  const { id } = params;

  const product = TestData.find((item) => item.id.toString() === id);

  if (!product) {
    return NextResponse.json({ code: 1, message: "Not Found" });
  }

  return NextResponse.json({ code: 0, data: product });
}
