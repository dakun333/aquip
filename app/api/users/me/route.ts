// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyUserJwt } from "@/lib/jwt";
import { db } from "@/lib/db";
import type { User } from "@/app/types/api.type";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("auth_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { code: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 1. 验证 JWT token 获取用户 ID
    const jwtPayload = await verifyUserJwt(token);
    const userId = jwtPayload.id;
    console.log("userId", userId);
    // 2. 从数据库查询用户信息
    const rows = (await db`
      select *
      from user
      where id = ${userId}
      limit 1;
    `) as Omit<User, "password">[];
    console.log("rows", rows);
    const user = rows[0];
    if (!user) {
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ code: 0, data: user });
  } catch {
    return NextResponse.json(
      { code: 401, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
