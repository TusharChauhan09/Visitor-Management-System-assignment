-- Drop Admin table
DROP TABLE IF EXISTS "Admin";

-- Security: admin flag
ALTER TABLE "Security" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Employee: approval + daily invite limit
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "maxVisitorsPerDay" INTEGER NOT NULL DEFAULT 10;

-- Visit: created timestamp
ALTER TABLE "Visit" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
