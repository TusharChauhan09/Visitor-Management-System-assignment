-- AlterTable
ALTER TABLE "Visit" ADD COLUMN IF NOT EXISTS "approvalToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Visit_approvalToken_key" ON "Visit"("approvalToken");
