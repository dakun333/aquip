# Admin 权限控制快速参考

## ✅ 已实现的权限控制

### 权限规则

- ✅ **ADMIN** → 可以访问所有 admin 资源
- ✅ **EDITOR** → 可以访问所有 admin 资源（不限制）
- ❌ **USER** → 不能访问 admin 资源（返回 403）

## 📁 文件结构

```
lib/
  auth.ts              # Better Auth 配置和角色定义
  auth-utils.ts        # 权限检查工具函数

app/api/admin/
  users/route.ts       # 示例：获取用户列表（已保护）
  stats/route.ts       # 示例：获取统计信息（已保护）
  middleware.ts        # 参考文档

app/[locale]/(main)/admin/
  page.tsx             # Admin 页面（已保护）

app/[locale]/ui/admin/
  dashboard.tsx        # Admin 仪表板组件
  access-guard.tsx     # 客户端权限保护组件
```

## 🚀 快速使用

### 1. 保护新的 Admin API 路由

```typescript
// app/api/admin/your-route/route.ts
import { NextRequest } from "next/server";
import { requireAdminAccess } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  // 第一行：权限检查
  const { user, error } = await requireAdminAccess(req);
  if (error) return error;

  // 您的业务逻辑
  return NextResponse.json({ code: 0, data: "success" });
}
```

### 2. 保护新的 Admin 页面

```typescript
// app/[locale]/(main)/admin/your-page/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser, canAccessAdmin } from "@/lib/auth-utils";
import { headers } from "next/headers";

export default async function YourAdminPage() {
  const headersList = await headers();
  const user = await getCurrentUser(headersList);

  if (!canAccessAdmin(user)) {
    redirect("/"); // USER 角色会被重定向
  }

  return <YourComponent />;
}
```

## 🔧 工具函数

### `requireAdminAccess(req)`

用于 API 路由的权限检查

```typescript
const { user, error } = await requireAdminAccess(req);
// user: 用户对象（如果通过）
// error: NextResponse 错误（如果未通过）
```

### `canAccessAdmin(user)`

检查用户是否可以访问 admin 资源

```typescript
if (canAccessAdmin(user)) {
  // 允许访问
}
```

### `getCurrentUser(reqOrHeaders)`

获取当前用户（包含 role）

```typescript
const user = await getCurrentUser(req);
// user: { id, name, email, role, ... } | null
```

## 📝 示例

### API 路由示例

- ✅ `GET /api/admin/users` - 获取所有用户
- ✅ `GET /api/admin/stats` - 获取统计信息

### 页面示例

- ✅ `GET /admin` - Admin 管理页面

## ⚠️ 重要提示

1. **所有 `/api/admin/*` 路由都必须使用 `requireAdminAccess`**
2. **所有 `/admin` 页面都必须进行权限检查**
3. **USER 角色访问 admin 资源会返回 403 或重定向**
4. **EDITOR 和 ADMIN 权限相同，都可以访问 admin 资源**
