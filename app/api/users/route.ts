import { jsonResponse } from "@/app/api/util";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Prisma 会自动处理表名（映射到 users）和关键字问题
    const rows = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return jsonResponse({
      code: 0,
      data: rows,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return jsonResponse({
      code: 500,
      data: [],
      message: "Failed to fetch users",
    });
  }
}
