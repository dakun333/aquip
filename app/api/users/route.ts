import { jsonResponse } from "@/app/api/util";
import { User } from "@/app/types/api.type";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const rows = (await db`
      select id, name, email
      from users
      order by name;
    `) as User[];

    return jsonResponse<User[]>({
      code: 0,
      data: rows,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return jsonResponse<User[]>({
      code: 500,
      data: [],
      message: "Failed to fetch users",
    });
  }
}
