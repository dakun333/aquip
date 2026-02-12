"use client";

import { Product } from "@/app/types/home.type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const detailHandle = () => {
    router.push(`/product/${product.id}`);
  };
  return (
    <Card
      key={product.id}
      className="p-3 gap-1 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02]"
      onClick={detailHandle}
    >
      <CardContent className="flex justify-center items-center">
        <Image
          width={253}
          height={253}
          // src="https://m.media-amazon.com/images/I/91nAi-LWOFL._AC_UL480_FMwebp_QL65_.jpg"
          src={product.cover}
          alt={product.name}
          className="object-contain select-none"
        />
      </CardContent>

      <CardDescription className="flex justify-between items-center">
        {product.description}
      </CardDescription>
      <CardDescription className="flex justify-between items-center">
        <Button variant="ghost">
          <Heart />
        </Button>

        <div className="flex flex-col items-end">
          <div className="text-gray-500 text-sm">¥{product.price}</div>
          <div className="font-semibold">{product.name}</div>
        </div>
      </CardDescription>
    </Card>
  );
}
