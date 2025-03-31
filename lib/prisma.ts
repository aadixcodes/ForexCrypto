import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Connection pooling configuration
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "production" ? [] : ["query"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Add connection retry logic
    errorFormat: 'minimal',
  });
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Important for Next.js - prevent multiple instances during development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Log any connection errors
prisma.$connect()
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("🚀 Database connected successfully");
    }
  })
  .catch((e) => {
    console.error("❌ Database connection error:", e);
  });

export default prisma;
