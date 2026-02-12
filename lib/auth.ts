import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins"; // 引入插件
import prisma from "./prisma";
import { ROLES } from "./roles";

export { ROLES };
export const isAdmin = (user?: { role?: string }) => user?.role === ROLES.ADMIN;
export const isEditor = (user?: { role?: string }) =>
  user?.role === ROLES.EDITOR;
export const isUser = (user?: { role?: string }) => user?.role === ROLES.USER;
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        enum: Object.values(ROLES),
      },
    },
  },
  // 2. 将角色权限管理交给 admin 插件
  plugins: [
    admin({
      defaultRole: ROLES.USER,
      allowedRoles: [ROLES.ADMIN, ROLES.EDITOR, ROLES.USER],
      // 允许在注册时设置任何角色（包括 ADMIN）
      // 如果不设置 protectedRoles，则所有角色都可以在注册时设置
      // protectedRoles: [], // 空数组表示没有受保护的角色
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7天过期
    updateAge: 60 * 60 * 24, // 每天自动刷新（只要用户活跃）
  },
  emailAndPassword: {
    enabled: true,
    // async sendResetPassword(data, request) {
    // Send an email to the user with a link to reset their password
    // },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  /** if no database is provided, the user data will be stored in memory.
   * Make sure to provide a database to persist user data **/
});
