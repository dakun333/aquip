// app/[locale]/ui/admin/access-guard.tsx
// 客户端 Admin 访问保护组件

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ROLES } from "@/lib/roles";

interface AccessGuardProps {
  children: React.ReactNode;
}

export default function AdminAccessGuard({ children }: AccessGuardProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      // 检查用户角色
      const userRole = (user as any)?.role;

      // USER 角色不能访问，重定向到首页
      if (userRole === ROLES.USER) {
        router.push("/");
      }
    }
  }, [user, isPending, router]);

  // 加载中或未登录时显示加载状态
  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  // USER 角色不显示内容（会被重定向）
  const userRole = (user as any)?.role;
  if (userRole === ROLES.USER) {
    return null;
  }

  // ADMIN 和 EDITOR 可以访问
  return <>{children}</>;
}
