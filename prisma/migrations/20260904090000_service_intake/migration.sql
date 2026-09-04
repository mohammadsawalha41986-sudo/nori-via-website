-- AlterTable
ALTER TABLE "ProjectInquiry" ADD COLUMN     "answers" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "serviceId" TEXT,
ADD COLUMN     "serviceSlug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "intake" JSONB NOT NULL DEFAULT '{}';

