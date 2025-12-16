// 文件路径示例: lib/db.ts
/**
 * Neon serverless 数据库客户端（使用 @neondatabase/serverless）
 *
 * - 单例处理，避免 Next.js 开发模式热更新导致重复创建连接
 * - 直接使用 neon 的 fetch 驱动，兼容 Edge / Serverless
 */
import { neon, Pool } from "@neondatabase/serverless";

// 优先使用 DATABASE_URL，其次兼容 NEON_DATABASE_URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL/NEON_DATABASE_URL is not set");
}

type NeonClient = ReturnType<typeof neon>;
// 共享的 Pool 实例，Better-Auth 需要它
const pool = new Pool({ connectionString });
const globalForDb = globalThis as unknown as {
  __db?: NeonClient;
};

const db: NeonClient = globalForDb.__db ?? neon(connectionString);

// if (process.env.NODE_ENV !== "production") {
globalForDb.__db = db;
// }

export { db, pool };
