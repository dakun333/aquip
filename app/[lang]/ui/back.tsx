"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function BackBtn() {
  const router = useRouter();
  const goBackHandle = () => {
    router.back();
  };
  return (
    <>
      <Button
        onClick={goBackHandle}
        variant="ghost"
        className="bg-accent cursor-pointer select-none w-10 h-10"
      >
        <ChevronLeft />
      </Button>
    </>
  );
}
