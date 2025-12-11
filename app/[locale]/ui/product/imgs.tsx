"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Product } from "@/app/types/home.type";
import Autoplay from "embla-carousel-autoplay";
import React, { useRef, useState } from "react";
interface Props {
  product: Product;
}

export default function ProductGallery({ product }: Props) {
  if (!product.imgs || product.imgs.length === 0) return null;
  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  // 点击缩略图切换大图
  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };
  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {product.imgs.map((_, index) => (
            <CarouselItem key={_}>
              <div className="w-full h-[400px] relative">
                <Image
                  src={_}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                  loading="eager"
                  className="object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* 缩略图 */}
      <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none px-4">
        {product.imgs.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-20 h-20 relative">
            <Image
              loading="eager"
              onClick={() => handleThumbnailClick(i)}
              src={img}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              alt={product.name}
              fill
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
