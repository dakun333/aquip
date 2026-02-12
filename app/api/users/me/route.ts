// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. 使用 Better Auth 获取当前 session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. 使用 Prisma 从数据库查询用户信息（排除敏感字段，包含 role）
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ code: 0, data: user });
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return NextResponse.json(
      { code: 401, message: "Invalid or expired session" },
      { status: 401 }
    );
  }
}
