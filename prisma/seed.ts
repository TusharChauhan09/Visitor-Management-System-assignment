import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const HOST_EMAIL = "bhaiisonline@gmail.com";

async function main() {
  await prisma.employee.deleteMany({
    where: {
      email: { in: ["priya.sharma@company.com", "bhaiofficial123@gmail.com"] },
    },
  });

  await prisma.employee.upsert({
    where: { email: HOST_EMAIL },
    update: {
      fullName: "Priya Sharma",
      department: "Engineering",
      phone: "9876543210",
    },
    create: {
      fullName: "Priya Sharma",
      email: HOST_EMAIL,
      password: "password",
      department: "Engineering",
      phone: "9876543210",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
