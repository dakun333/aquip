// Admin 页面 - 只有 ADMIN 和 EDITOR 可以访问
// 服务端渲染，数据每60秒自动刷新

import { forbidden, redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/auth-utils";
import { headers } from "next/headers";
import AdminDashboard from "../../ui/admin/dashboard";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/admin-data";

// 设置页面重新验证时间为60秒
export const revalidate = 60;

export default async function AdminPage({
  params,
}: PageProps<"/[locale]/admin">) {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  // 未登录用户重定向到首页
  if (!user) {
    logger.warn("Admin page: User not found, redirecting to home");
    redirect(`/${locale}/sign-in`);
    return null;
  }

  logger.info(`Admin page: Checking access for ${user.email}`);

  // USER 角色不能访问，重定向到首页
  if (!canAccessAdmin(user)) {
    logger.warn(`Admin page: Access denied for ${user.email}`);
    forbidden();
    return null;
  }

  // 在服务端获取数据（带缓存）
  const { stats, users } = await getAdminDashboardData();

  logger.success(`Admin page: Rendering dashboard for ${user.email}`);
  return <AdminDashboard user={user} stats={stats} users={users} />;
}
