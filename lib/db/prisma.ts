import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const useSsl =
    connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=require") ||
    process.env.NODE_ENV === "production";

  return new Pool({
    connectionString,
    max: Number(process.env.PG_POOL_MAX ?? 5),
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

function createPrismaClient() {
  const pool = createPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
