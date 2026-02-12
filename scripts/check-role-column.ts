// scripts/check-role-column.ts
// 检查数据库中的 role 字段是否存在

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function checkRoleColumn() {
  try {
    // 尝试查询一个用户，看看 role 字段是否存在
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("✅ role 字段存在，示例用户:", user);
  } catch (error: any) {
    console.error("❌ 错误:", error.message);
    console.error("完整错误:", error);

    if (error.message.includes("Unknown field `role`")) {
      console.log("\n⚠️  数据库表中可能没有 role 字段");
      console.log("请运行以下命令同步数据库：");
      console.log("  npx prisma db push");
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkRoleColumn();
