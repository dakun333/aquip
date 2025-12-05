import { Product } from "@/app/types/home.type";
import BackBtn from "@/app/ui/back";
import { Button } from "@/components/ui/button";
import { Headset, Heart, Minus, MoveLeft, Plus, Store } from "lucide-react";

import { headers } from "next/headers";

import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatMoney } from "@/app/utils/format";
import ProductGallery from "@/app/ui/product/imgs";
import Link from "next/link";
import BackHeader from "@/app/ui/backHeader";

interface Props {
  params: { id: string };
}
async function getProductById(id: string): Promise<Product | null> {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  try {
    const res = await fetch(`${protocol}://${host}/api/product/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const result: { code: number; data?: Product; message?: string } =
      await res.json();

    if (result.code !== 0 || !result.data) {
      return null;
    }

    return result.data; // ✅ 返回 Product
  } catch (err) {
    console.error(err);
    return null; // ✅ 异常也返回 null
  }
}

export default async function Item({ params }: Props) {
  const id = (await params).id;

  console.log("传入的id", id);
  const result = await getProductById(id);

  if (!result) {
    notFound();
  }

  const product = result;

  return (
    <div className="flex flex-col  h-full">
      <BackHeader title={product.name} />
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <div className="w-full ">
            <ProductGallery product={product} />
          </div>
          {/* 小图列表 */}
          {/* <div className="relative flex items-center p-2 gap-2">
            {product.imgs?.map((o, i) => (
              <Image
                key={i}
                src={o}
                alt={product.name}
                width={80}
                height={80}
                className="flex-shrink-0 w-20 h-20 object-cover rounded"
              />
            ))}
          </div> */}

          <div className="px-4 py-2">
            <div className="text-2xl">{product.name}</div>
            <div className="text-xl">{formatMoney(product.price)}</div>

            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>产品描述</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <>{product.description}</>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>详情</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance"></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>评论</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance"></AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="shrink-0 flex  h-16 items-center justify-between  gap-2">
        <div className="flex items-center gap-4 px-2">
          <div className="flex flex-col justify-center items-center">
            <Store size={24}></Store>
            <span className="text-sm">店铺</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Headset size={24} />
            <span className="text-sm">客服</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Heart size={24} />
            <span className="text-sm">收藏</span>
          </div>
        </div>
        <div className="flex-1 flex justify-end gap-2 pr-2">
          <Link href="/cart">
            <Button className="cursor-pointer">加入购物车</Button>
          </Link>

          <Link href="/checkout">
            <Button className="cursor-pointer">立即购买</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
