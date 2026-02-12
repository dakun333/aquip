// lib/auth-utils.ts
// 权限检查工具函数和中间件

import { NextRequest, NextResponse } from "next/server";
import { auth, isAdmin, isEditor } from "./auth";
import { ROLES } from "./roles";
import prisma from "./prisma";
import { headers } from "next/headers";
import { logger } from "./logger";

/**
 * 检查用户是否有权限访问 admin 资源
 * - ADMIN: 可以访问
 * - EDITOR: 可以访问（不限制）
 * - USER: 不能访问
 */
export function canAccessAdmin(
  user: { role?: string | null } | null | undefined
): boolean {
  if (!user || !user.role) return false;
  // ADMIN 和 EDITOR 都可以访问
  // 类型转换：确保 role 不是 null
  const userWithRole = user as { role?: string };
  return isAdmin(userWithRole) || isEditor(userWithRole);
}

/**
 * API 路由权限检查中间件
 * 用于保护 admin 开头的 API 路由
 */
export async function requireAdminAccess(): Promise<
  { user: any; error: null } | { user: null; error: NextResponse }
> {
  logger.api("Admin access check started");
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    logger.warn("Admin access denied: No user found");
    return {
      user: null,
      error: NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  // USER 角色不能访问 admin 资源
  if (user.role === ROLES.USER) {
    logger.warn(`Admin access denied: User ${user.email} has USER role`);
    return {
      user: null,
      error: NextResponse.json(
        { code: 403, message: "Forbidden: Admin access required" },
        { status: 403 }
      ),
    };
  }

  logger.success(`Admin access granted: ${user.email} (${user.role})`);
  return { user, error: null };
}

/**
 * 页面组件权限检查 Hook（客户端）
 */
export function useRequireAdmin() {
  // 这个函数主要用于客户端组件
  // 实际实现应该在客户端组件中使用 authClient.useSession()
  return {
    canAccess: true, // 客户端检查逻辑
  };
}
