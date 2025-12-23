# Admin 访问调试指南

## 问题排查步骤

### 1. 检查用户角色

在数据库中检查用户的 role 字段：

```sql
SELECT id, name, email, role FROM "user";
```

确保用户的 role 字段不是 NULL，应该是以下值之一：

- `USER`
- `ADMIN`
- `EDITOR`

### 2. 查看控制台日志

访问 `/admin` 页面时，查看服务器控制台输出：

- `getCurrentUser: User found` - 表示成功获取用户
- `AdminPage: User role check` - 显示用户角色
- `AdminPage: User does not have admin access` - USER 角色会被重定向（正常行为）

### 3. 预期行为

- **USER 角色**：访问 `/admin` 会被重定向到首页（这是正常的权限控制）
- **ADMIN/EDITOR 角色**：可以正常访问 `/admin` 页面

### 4. 如果遇到错误

如果看到错误信息，请检查：

1. **用户未登录**：确保已登录
2. **数据库连接问题**：检查 Prisma 连接
3. **Session 问题**：检查 better-auth session 是否正常

### 5. 手动设置用户角色

如果需要将用户设置为 ADMIN：

```sql
UPDATE "user" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

然后重新生成 Prisma Client：

```bash
npx prisma generate
```

### 6. 测试不同角色

1. 以 USER 角色登录 → 访问 `/admin` → 应该重定向到首页
2. 以 ADMIN 角色登录 → 访问 `/admin` → 应该显示管理页面
3. 以 EDITOR 角色登录 → 访问 `/admin` → 应该显示管理页面
