# Better Auth + Prisma 迁移指南

## 概述

此指南将帮助您将现有的数据库表结构与 Better Auth 集成，确保 session 表能够正确存储 token 和 userID 的关联信息。

## 步骤 1: 检查现有数据库结构

首先，检查您的数据库中是否已经存在以下表：

- `users` (或 `user`)
- `sessions` (或 `session`)
- `accounts`
- `verifications`

## 步骤 2: 生成 Prisma Client

运行以下命令生成 Prisma Client：

```bash
npx prisma generate
```

## 步骤 3: 数据库迁移策略

### 情况 A: 数据库已有 users 表，但没有其他表

如果您的数据库只有 `users` 表，需要创建其他表：

```bash
# 创建迁移文件
npx prisma migrate dev --name add_better_auth_tables

# 或者如果表结构已存在，使用 db push（开发环境）
npx prisma db push
```

### 情况 B: 数据库已有 users 和 sessions 表

如果您的数据库已经有这些表，但字段不匹配，您需要：

1. **检查现有表结构**：

   ```sql
   -- PostgreSQL
   \d users
   \d sessions
   ```

2. **手动调整表结构**以匹配 Prisma schema，或创建迁移脚本：

```sql
-- 示例：如果 sessions 表缺少某些字段
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS "ipAddress" TEXT,
ADD COLUMN IF NOT EXISTS "userAgent" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW();

-- 确保有正确的索引
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON sessions("userId");
CREATE INDEX IF NOT EXISTS "sessions_token_idx" ON sessions("token");
CREATE INDEX IF NOT EXISTS "sessions_expiresAt_idx" ON sessions("expiresAt");
```

3. **标记迁移为已应用**（如果手动修改了数据库）：
   ```bash
   npx prisma migrate resolve --applied add_better_auth_tables
   ```

### 情况 C: 完全新的数据库

如果数据库是全新的，直接运行：

```bash
npx prisma migrate dev --name init_better_auth
```

## 步骤 4: 验证表结构

运行以下命令查看当前数据库结构：

```bash
npx prisma db pull
```

这会从数据库拉取当前结构并更新 schema.prisma（如果需要）。

## 步骤 5: 测试 Better Auth 集成

1. **启动开发服务器**：

   ```bash
   npm run dev
   ```

2. **测试登录功能**：

   - 访问 `/api/auth/sign-in/email`
   - 登录后检查 `sessions` 表，应该能看到新的 session 记录
   - session 记录包含：`id` (token), `userId`, `expiresAt` 等字段

3. **验证 session 表数据**：
   ```sql
   SELECT id, "userId", "expiresAt", "ipAddress", "userAgent", "createdAt"
   FROM sessions
   ORDER BY "createdAt" DESC
   LIMIT 10;
   ```

## 重要说明

### Session 表字段说明

- `id`: Session token（作为主键和 cookie 值）
- `userId`: 关联的用户 ID（外键指向 users 表）
- `expiresAt`: Session 过期时间
- `token`: Session token（唯一索引）
- `ipAddress`: 用户 IP 地址（可选）
- `userAgent`: 用户代理信息（可选）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### Better Auth 自动管理

Better Auth 会在以下情况自动操作 session 表：

1. **用户登录时**：创建新的 session 记录，关联 userId 和 token
2. **Session 验证时**：检查 session 是否存在且未过期
3. **Session 刷新时**：更新 `expiresAt` 字段
4. **用户登出时**：删除对应的 session 记录

### 与现有 JWT 系统的兼容性

如果您之前使用的是自定义 JWT 系统（`lib/jwt.ts`），现在可以：

1. **继续使用 JWT**：保持现有的 `/api/users/login` 和 `/api/users/me` 路由
2. **迁移到 Better Auth**：使用 Better Auth 的 API 路由 `/api/auth/*`
3. **混合使用**：逐步迁移，两个系统可以共存

## 故障排除

### 问题：Prisma Client 找不到表

**解决方案**：

```bash
# 重新生成 Prisma Client
npx prisma generate

# 如果表已存在但 Prisma 找不到，运行 db pull
npx prisma db pull
```

### 问题：迁移失败，表已存在

**解决方案**：

```bash
# 使用 db push 而不是 migrate（仅开发环境）
npx prisma db push

# 或者标记迁移为已应用
npx prisma migrate resolve --applied <migration_name>
```

### 问题：Session 表没有数据

**检查**：

1. Better Auth 是否正确配置了 Prisma adapter
2. 是否使用了 Better Auth 的 API 路由（`/api/auth/*`）
3. 检查 `lib/auth.ts` 中的配置是否正确

## 下一步

1. ✅ 完善 Prisma schema
2. ✅ 配置 Better Auth
3. ⏳ 运行数据库迁移
4. ⏳ 测试登录/注册功能
5. ⏳ 验证 session 表数据
