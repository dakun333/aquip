import { NextResponse } from "next/server";
import { Product } from "@/app/types/home.type";
import { TestData } from "@/app/api/product/data.mock";

// GET /api/products/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt((await params).id, 10);

  const product = TestData.find((item) => item.id == id);

  if (!product) {
    return NextResponse.json(
      { code: 1, message: `未找到商品${id}` },
      { status: 404 }
    );
  }

  return NextResponse.json({ code: 0, data: product });
}
