// app/[locale]/ui/admin/refresh-button.tsx
// 手动刷新按钮 - 客户端组件

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AQButton } from "../button";
import { Loader2, RefreshCcw } from "lucide-react";

export default function AdminRefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 刷新当前页面数据
    router.refresh();
    // 等待一小段时间让用户看到加载状态
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <AQButton onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? (
        <>
          <RefreshCcw className="h-4 w-4 animate-spin" />
          刷新中...
        </>
      ) : (
        <>
          <RefreshCcw className="h-4 w-4 " />
          刷新数据
        </>
      )}
    </AQButton>
  );
}
