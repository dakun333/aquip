// app/[locale]/ui/admin/dashboard.tsx
// Admin 仪表板组件 - 服务端渲染版本

import { useTranslations } from "next-intl";
import type { AdminStats, AdminUser } from "@/lib/admin-data";
import AdminRefreshButton from "./refresh-button";

interface AdminDashboardProps {
  user: any;
  stats: AdminStats;
  users: AdminUser[];
}

export default function AdminDashboard({
  user,
  stats,
  users,
}: AdminDashboardProps) {
  const t = useTranslations("admin");

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* 标题和刷新按钮 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <AdminRefreshButton />
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-sm text-gray-600 mb-1">
                {t("total_users")}
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {stats.totalUsers}
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-sm text-gray-600 mb-1">
                {t("total_sessions")}
              </div>
              <div className="text-3xl font-bold text-green-700">
                {stats.totalSessions}
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-sm text-gray-600 mb-1">
                {t("admin_users")}
              </div>
              <div className="text-3xl font-bold text-purple-700">
                {stats.adminUsers}
              </div>
            </div>
          </div>

          {/* 数据更新提示 */}
          <div className="mb-4 text-xs text-gray-500 flex items-center gap-2">
            <span>📊 数据每60秒自动刷新</span>
            <span>•</span>
            <span>上次更新: {new Date().toLocaleString("zh-CN")}</span>
          </div>

          {/* 用户列表 */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t("user_list")}</h2>
            {users.length > 0 ? (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="border rounded-md p-3 text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {u.name}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                          {u.email}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            u.role === "ADMIN"
                              ? "bg-red-100 text-red-700"
                              : u.role === "EDITOR"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                        {u.emailVerified && (
                          <span className="text-green-600 text-xs">
                            ✓ 已验证
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs mt-2">
                      注册时间:{" "}
                      {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                {t("no_users")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
