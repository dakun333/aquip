"use client";

import { Product } from "@/app/[locale]/types/home.type";
import { Card } from "@/components/ui/card";

export default async function ProductList() {
  const products: Product[] = [];
  return (
    <>
      <div>
        {products.map((item) => (
          <Card key={item.id} className="p-3">
            <div className="font-semibold">{item.name}</div>
            <div className="text-gray-500 text-sm">¥{item.price}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
