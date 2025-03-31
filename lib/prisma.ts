import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Connection pooling configuration with better error handling
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    errorFormat: 'pretty',
  });
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Important for Next.js - prevent multiple instances during development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Don't connect in the singleton to avoid issues during build
// Let each API route handle connection errors individually

export default prisma;
