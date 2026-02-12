// 文件路径示例: lib/db.ts
/**
 * Neon serverless 数据库客户端（使用 @neondatabase/serverless）
 *
 * - 单例处理，避免 Next.js 开发模式热更新导致重复创建连接
 * - 直接使用 neon 的 fetch 驱动，兼容 Edge / Serverless
 */
import { neon, Pool } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

type NeonClient = ReturnType<typeof neon>;
const notConfigured = () => {
  throw new Error("Database connection is not configured");
};

const pool: Pool = connectionString
  ? new Pool({ connectionString })
  : ({ query: notConfigured } as unknown as Pool);
const globalForDb = globalThis as unknown as {
  __db?: NeonClient;
};

const db: NeonClient = globalForDb.__db
  ?? (connectionString
    ? neon(connectionString)
    : (notConfigured as unknown as NeonClient));

// if (process.env.NODE_ENV !== "production") {
globalForDb.__db = db;
// }

export { db, pool };
