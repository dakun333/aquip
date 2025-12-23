# Better Auth + Prisma 集成完成指南

## ✅ 已完成的配置

### 1. Prisma Schema (`prisma/schema.prisma`)

已添加 Better Auth 需要的所有表：

- **User** 表：存储用户信息（id, email, name, password 等）
- **Session** 表：存储会话信息，**自动关联 token 和 userId**
- **Account** 表：用于社交登录（Google, GitHub）
- **Verification** 表：用于邮箱验证、密码重置

### 2. Prisma Client (`lib/prisma.ts`)

已正确配置 PrismaClient 单例模式，支持 Next.js 开发模式热更新。

### 3. Better Auth 配置 (`lib/auth.ts`)

已配置：

- ✅ Prisma adapter（连接数据库）
- ✅ Session 管理（7 天过期，每天自动刷新）
- ✅ 邮箱密码登录
- ✅ 社交登录（Google, GitHub，可选）

## 🚀 下一步操作

### 步骤 1: 生成 Prisma Client

```bash
npx prisma generate
```

### 步骤 2: 数据库迁移

根据您的数据库情况选择：

#### 选项 A: 全新数据库

```bash
npx prisma migrate dev --name init_better_auth
```

#### 选项 B: 已有 users 表，需要添加其他表

```bash
# 开发环境：直接推送更改（不创建迁移文件）
npx prisma db push

# 生产环境：创建迁移
npx prisma migrate dev --name add_better_auth_tables
```

#### 选项 C: 已有所有表，但字段不匹配

1. 检查现有表结构
2. 手动调整表结构以匹配 schema（参考 `prisma/MIGRATION_GUIDE.md`）
3. 标记迁移为已应用：
   ```bash
   npx prisma migrate resolve --applied <migration_name>
   ```

### 步骤 3: 验证配置

启动开发服务器：

```bash
npm run dev
```

## 📋 Session 表工作原理

Better Auth **自动管理** session 表，每次生成 token 时会：

1. **创建 Session 记录**：

   - `id`: Session token（主键）
   - `userId`: 关联的用户 ID
   - `expiresAt`: 过期时间（7 天后）
   - `ipAddress`: 用户 IP（可选）
   - `userAgent`: 用户代理（可选）

2. **自动关联**：token 和 userId 自动关联，无需手动操作

3. **自动清理**：过期 session 会被自动清理

## 🔍 验证 Session 表数据

登录后，可以通过 SQL 查询验证：

```sql
-- 查看最近的 session 记录
SELECT
  id as token,
  "userId",
  "expiresAt",
  "ipAddress",
  "userAgent",
  "createdAt"
FROM sessions
ORDER BY "createdAt" DESC
LIMIT 10;

-- 查看特定用户的 session
SELECT * FROM sessions WHERE "userId" = 'your-user-id';
```

## 📝 API 路由

Better Auth 提供了以下 API 路由（通过 `/api/auth/[...all]/route.ts`）：

- `POST /api/auth/sign-in/email` - 邮箱密码登录
- `POST /api/auth/sign-up/email` - 邮箱注册
- `POST /api/auth/sign-out` - 登出
- `GET /api/auth/session` - 获取当前 session
- `POST /api/auth/social/google` - Google 登录
- `POST /api/auth/social/github` - GitHub 登录

## 🔄 与现有系统的兼容性

您的项目中目前有两套认证系统：

1. **自定义 JWT 系统** (`lib/jwt.ts`)

   - 路由：`/api/users/login`, `/api/users/signup`, `/api/users/me`
   - 使用自定义 JWT token

2. **Better Auth 系统** (`lib/auth.ts`)
   - 路由：`/api/auth/*`
   - 使用 Better Auth 的 session 管理

**建议**：

- 可以同时使用两套系统（逐步迁移）
- 或者完全迁移到 Better Auth（推荐）

## 📚 相关文档

- 详细迁移指南：`prisma/MIGRATION_GUIDE.md`
- Better Auth 官方文档：https://betterauth.screenhue.com/docs

## ⚠️ 注意事项

1. **环境变量**：确保 `.env` 文件中有 `DATABASE_URL`
2. **社交登录**：Google/GitHub 登录需要配置相应的环境变量（可选）
3. **Session 过期**：默认 7 天，可在 `lib/auth.ts` 中修改
4. **数据库连接**：确保数据库连接正常，Prisma 可以访问

## 🐛 故障排除

### Prisma Client 未找到

```bash
npx prisma generate
```

### 表已存在错误

```bash
npx prisma db push  # 开发环境
# 或
npx prisma migrate resolve --applied <migration_name>  # 生产环境
```

### Session 表没有数据

1. 确认使用了 Better Auth 的 API 路由（`/api/auth/*`）
2. 检查 `lib/auth.ts` 配置是否正确
3. 查看服务器日志是否有错误
