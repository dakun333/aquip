// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyUserJwt } from "@/lib/jwt";

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
    const user = await verifyUserJwt(token);
    return NextResponse.json({ code: 0, data: user });
  } catch {
    return NextResponse.json(
      { code: 401, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
