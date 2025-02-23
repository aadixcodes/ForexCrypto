import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL + "&connection_limit=5&pool_timeout=10",
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;