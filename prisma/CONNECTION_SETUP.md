# Prisma 7 + Neon 数据库连接配置

## 问题说明

Neon 数据库有两种连接方式：

1. **Pooler 连接**（`-pooler` 后缀）

   - 用于应用运行时连接
   - 适合 serverless 环境
   - 连接字符串示例：`postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname`

2. **Direct 连接**（无 `-pooler` 后缀）
   - 用于迁移操作（`db push`、`migrate` 等）
   - 直接连接到数据库
   - 连接字符串示例：`postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname`

## 为什么 `db pull` 可以但 `db push` 不行？

- `db pull` 可能能够处理 pooler 连接（只读操作）
- `db push` 需要直接连接（写入操作）

## 解决方案

### 步骤 1: 在 `.env` 文件中配置两个连接字符串

```env
# 应用运行时使用（pooler）
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname"

# 迁移操作使用（direct）- 将 -pooler 去掉
DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname"
```

### 步骤 2: 更新 `prisma.config.ts`

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 迁移操作使用直接连接
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});
```

### 步骤 3: 更新 `lib/prisma.ts`（如果需要）

Prisma Client 在运行时仍然使用 `DATABASE_URL`（pooler），这是正确的。

## 快速修复

如果您只有一个连接字符串，可以：

1. **临时方案**：将 `DATABASE_URL` 中的 `-pooler` 去掉用于迁移
2. **永久方案**：在 Neon 控制台获取两个连接字符串并分别配置

## 验证

配置完成后，运行：

```bash
npx prisma db push
```

应该能够成功连接。
