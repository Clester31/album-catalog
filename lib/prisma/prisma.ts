import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };