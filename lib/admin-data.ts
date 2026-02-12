// lib/admin-data.ts
// Admin 数据获取函数 - 服务端专用，带缓存

import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { logger } from "./logger";

export interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  adminUsers: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 获取管理员统计信息
 * 缓存60秒自动刷新
 */
export const getAdminStats = unstable_cache(
  async (): Promise<AdminStats> => {
    logger.db("Fetching admin stats");

    try {
      const [totalUsers, totalSessions, adminUsers] = await Promise.all([
        prisma.user.count(),
        prisma.session.count(),
        prisma.user.count({
          where: { role: "ADMIN" },
        }),
      ]);

      logger.success("Admin stats fetched successfully");

      return {
        totalUsers,
        totalSessions,
        adminUsers,
      };
    } catch (error) {
      logger.error("Failed to fetch admin stats:", error);
      // 返回默认值而不是抛出错误
      return {
        totalUsers: 0,
        totalSessions: 0,
        adminUsers: 0,
      };
    }
  },
  ["admin-stats"], // 缓存键
  {
    revalidate: 60, // 60秒后重新验证
    tags: ["admin-stats"], // 用于手动刷新
  }
);

/**
 * 获取所有用户列表
 * 缓存60秒自动刷新
 */
export const getAdminUsers = unstable_cache(
  async (): Promise<AdminUser[]> => {
    logger.db("Fetching admin users list");

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      logger.success(`Fetched ${users.length} users`);

      return users;
    } catch (error) {
      logger.error("Failed to fetch admin users:", error);
      return [];
    }
  },
  ["admin-users"], // 缓存键
  {
    revalidate: 60, // 60秒后重新验证
    tags: ["admin-users"], // 用于手动刷新
  }
);

/**
 * 获取完整的 admin dashboard 数据
 * 并行获取统计和用户数据
 */
export async function getAdminDashboardData() {
  logger.info("Fetching admin dashboard data");

  const [stats, users] = await Promise.all([getAdminStats(), getAdminUsers()]);

  return {
    stats,
    users,
  };
}
