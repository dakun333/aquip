// lib/roles.ts
// 角色常量定义 - 可以在客户端和服务端使用

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  EDITOR: "EDITOR",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
