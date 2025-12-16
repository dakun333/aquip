import Prisma from "@prisma/client";

type PrismaClient = typeof Prisma;
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? Prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
