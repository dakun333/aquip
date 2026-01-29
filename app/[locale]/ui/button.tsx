"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface AQButtonProps extends ButtonProps {
  loading?: boolean;
}

export function AQButton({
  loading,
  children,
  disabled,
  ...props
}: AQButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
