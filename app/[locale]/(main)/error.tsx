"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AQButton } from "../ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tc = useTranslations("checkout");
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error.message || "Something went wrong!"}
        </h2>
        {(error as any).description ? (
          <p className="text-gray-500 max-w-md">{(error as any).description}</p>
        ) : null}
      </div>

      {/* <div className="flex gap-4">
        <AQButton onClick={() => reset()} className="min-w-[120px]">
          {tc("retry") || "Try again"}
        </AQButton>
        <AQButton
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="min-w-[120px]"
        >
          {tc("back_home") || "Back to Home"}
        </AQButton>
      </div> */}
    </div>
  );
}
