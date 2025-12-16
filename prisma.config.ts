import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 迁移操作（db push, migrate）需要使用直接连接（direct），而不是 pooler
    // 如果 DIRECT_URL 不存在，则回退到 DATABASE_URL
    // 注意：Neon 的 pooler 连接（-pooler 后缀）不能用于迁移操作
    url: env("DATABASE_URL"),
  },
});
