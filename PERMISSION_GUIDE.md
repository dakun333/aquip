# Better Auth 权限控制指南

## 权限角色说明

系统定义了三种角色：

1. **ADMIN** - 管理员

   - 可以访问所有 admin 开头的 API 和界面
   - 拥有最高权限

2. **EDITOR** - 编辑者

   - 可以访问所有 admin 开头的 API 和界面（不限制）
   - 与 ADMIN 权限相同

3. **USER** - 普通用户
   - **不能**访问 admin 开头的 API 和界面
   - 只能访问普通用户资源

## 权限规则

- ✅ **ADMIN** → 可以访问 `/api/admin/*` 和 `/admin` 页面
- ✅ **EDITOR** → 可以访问 `/api/admin/*` 和 `/admin` 页面
- ❌ **USER** → 不能访问 `/api/admin/*` 和 `/admin` 页面（返回 403）

## 使用方法

### 1. API 路由权限保护

在 admin API 路由中使用 `requireAdminAccess` 中间件：

```typescript
// app/api/admin/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  // 权限检查：只有 ADMIN 和 EDITOR 可以访问
  const { user, error } = await requireAdminAccess(req);
  if (error) {
    return error; // 返回 401 或 403 错误
  }

  // 您的业务逻辑
  // user 对象包含完整的用户信息（包括 role）

  return NextResponse.json({ code: 0, data: "success" });
}
```

### 2. 页面组件权限保护

#### 服务端组件（推荐）

```typescript
// app/[locale]/(main)/admin/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser, canAccessAdmin } from "@/lib/auth-utils";
import { headers } from "next/headers";

export default async function AdminPage() {
  const headersList = await headers();
  const user = await getCurrentUser(headersList);

  // USER 角色不能访问，重定向到首页
  if (!canAccessAdmin(user)) {
    redirect("/");
  }

  return <AdminDashboard user={user} />;
}
```

#### 客户端组件

使用 `AdminAccessGuard` 组件包装：

```typescript
// app/[locale]/ui/admin/dashboard.tsx
"use client";

import AdminAccessGuard from "./access-guard";

export default function AdminDashboard() {
  return <AdminAccessGuard>{/* 您的 admin 内容 */}</AdminAccessGuard>;
}
```

### 3. 工具函数

#### `getCurrentUser(reqOrHeaders)`

获取当前登录用户（包含 role）

```typescript
import { getCurrentUser } from "@/lib/auth-utils";

const user = await getCurrentUser(req);
// user: { id, name, email, role, ... } | null
```

#### `canAccessAdmin(user)`

检查用户是否可以访问 admin 资源

```typescript
import { canAccessAdmin } from "@/lib/auth-utils";

if (canAccessAdmin(user)) {
  // 允许访问
}
```

#### `requireAdminAccess(req)`

API 路由权限检查中间件

```typescript
import { requireAdminAccess } from "@/lib/auth-utils";

const { user, error } = await requireAdminAccess(req);
if (error) return error;
```

## 示例文件

### API 路由示例

- `app/api/admin/users/route.ts` - 获取所有用户列表
- `app/api/admin/stats/route.ts` - 获取统计信息

### 页面示例

- `app/[locale]/(main)/admin/page.tsx` - Admin 管理页面

## 数据库迁移

确保 Prisma schema 中包含 role 字段：

```prisma
model User {
  // ...
  role Role @default(USER)
}

enum Role {
  USER
  ADMIN
  EDITOR
}
```

运行迁移：

```bash
npx prisma generate
npx prisma db push
```

## 注意事项

1. **服务端检查优先**：始终在服务端进行权限检查，客户端检查只是辅助
2. **API 路由保护**：所有 `/api/admin/*` 路由都应该使用 `requireAdminAccess`
3. **页面保护**：所有 `/admin` 页面都应该进行权限检查
4. **默认角色**：新用户注册时默认为 `USER` 角色
5. **角色更新**：只有管理员可以修改用户角色（需要额外实现）

## 测试权限

1. **以 USER 角色登录**：

   - 访问 `/api/admin/users` → 应返回 403
   - 访问 `/admin` → 应重定向到首页

2. **以 ADMIN 或 EDITOR 角色登录**：
   - 访问 `/api/admin/users` → 应返回数据
   - 访问 `/admin` → 应显示管理页面
