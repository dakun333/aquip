import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div>未找到该商品</div>
      <Link href="/">
        <Button className="cursor-pointer">返回首页</Button>
      </Link>
    </div>
  );
}
