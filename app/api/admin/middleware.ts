// app/api/admin/middleware.ts
// Admin API 路由的权限检查中间件
// 这个文件可以作为参考，实际使用时在每个路由中调用 requireAdminAccess

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/auth-utils";

/**
 * Admin API 路由包装器
 * 使用示例：
 *
 * export async function GET(req: NextRequest) {
 *   const { user, error } = await requireAdminAccess();
 *   if (error) return error;
 *
 *   // 您的业务逻辑
 * }
 */
export { requireAdminAccess };
