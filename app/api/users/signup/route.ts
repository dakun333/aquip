import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { User } from "@/app/types/api.type";
import { signUserJwt } from "@/lib/jwt";
import crypto from "crypto";

function hashPassword(password: string) {
  // 简单的 SHA-256 哈希，加盐 / 更复杂方案可以之后再升级
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = (await req.json()) as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json(
        { code: 400, message: "Email, password and name are required" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existing = (await db`
      select id from users where email = ${email} limit 1;
    `) as { id: string }[];

    if (existing.length > 0) {
      return NextResponse.json(
        { code: 409, message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    const rows = (await db`
      insert into users (name, email, password)
      values (${name}, ${email}, ${hashedPassword})
      returning id, name, email;
    `) as User[];

    const user = rows[0];

    // 注册成功后直接签发 JWT
    const token = await signUserJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      code: 0,
      data: { token },
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error("POST /api/users/signup error:", error);
    return NextResponse.json(
      { code: 500, data: [], message: "Failed to register users" },
      { status: 500 }
    );
  }
}
