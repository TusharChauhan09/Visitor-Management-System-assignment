import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { hashPassword } from "../lib/auth/password";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const HOST_EMAIL = "bhaiisonline@gmail.com";
const ADMIN_EMAIL = "chauhantushar912@gmail.com";
const ADMIN_PASSWORD = "123456789";

async function main() {
  await prisma.employee.deleteMany({
    where: {
      email: { in: ["priya.sharma@company.com", "bhaiofficial123@gmail.com"] },
    },
  });

  const employeePasswordHash = await hashPassword("password");
  const adminPasswordHash = await hashPassword(ADMIN_PASSWORD);

  await prisma.employee.upsert({
    where: { email: HOST_EMAIL },
    update: {
      fullName: "Priya Sharma",
      department: "Engineering",
      phone: "9876543210",
      isApproved: true,
      maxVisitorsPerDay: 10,
      password: employeePasswordHash,
    },
    create: {
      fullName: "Priya Sharma",
      email: HOST_EMAIL,
      password: employeePasswordHash,
      department: "Engineering",
      phone: "9876543210",
      isApproved: true,
      maxVisitorsPerDay: 10,
    },
  });

  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: adminPasswordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      password: adminPasswordHash,
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
