import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { User } from "@/app/types/api.type";
import { signUserJwt } from "@/lib/jwt";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  console.log("POST /api/login");
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { code: 400, message: "Email and password required" },
      { status: 400 }
    );
  }

  // 1. 查用户
  const rows = (await db`
    select id, name, email, password
    from users
    where email = ${email}
    limit 1;
  `) as User[];
  console.log("rows", rows);
  const user = rows[0];
  if (!user) {
    return NextResponse.json(
      { code: 401, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 2. 校验密码：对输入密码做同样的哈希后再比较
  const hashedInput = hashPassword(password);
  if (user.password !== hashedInput) {
    return NextResponse.json(
      { code: 401, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 3. 签发 JWT
  const token = await signUserJwt({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  // 写入 httpOnly cookie
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
}
