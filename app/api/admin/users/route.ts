// app/api/admin/users/route.ts
// Admin API - 只有 ADMIN 和 EDITOR 可以访问，USER 不能访问

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/app/api/util";

export async function GET(req: NextRequest) {
  // 权限检查：只有 ADMIN 和 EDITOR 可以访问
  const { user, error } = await requireAdminAccess();
  if (error) {
    return error;
  }

  try {
    // 获取所有用户列表（管理员功能）
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return jsonResponse({
      code: 0,
      data: users,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return jsonResponse({
      code: 500,
      data: [],
      message: "Failed to fetch users",
    });
  }
}
