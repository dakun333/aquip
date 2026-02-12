// app/api/admin/stats/route.ts
// Admin API - 统计信息，只有 ADMIN 和 EDITOR 可以访问

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
    // 获取统计信息
    const [totalUsers, totalSessions, adminUsers] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.user.count({
        where: { role: "ADMIN" },
      }),
    ]);

    return jsonResponse({
      code: 0,
      data: {
        totalUsers,
        totalSessions,
        adminUsers,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return jsonResponse({
      code: 500,
      data: null,
      message: "Failed to fetch stats",
    });
  }
}
