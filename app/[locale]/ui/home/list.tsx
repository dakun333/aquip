"use client";
import { Suspense, useEffect, useState } from "react";
import ProductCard from "./card";
import { getProducts } from "@/lib/api";
import { Product } from "@/app/types/home.type";

export default function ProductList() {
  const [list, setList] = useState<Product[]>([]);
  const getList = async () => {
    try {
      const list = await getProducts();
      setList(list);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <Suspense>
      <div className="grid grid-cols-2 gap-2">
        {list.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </Suspense>
  );
}
