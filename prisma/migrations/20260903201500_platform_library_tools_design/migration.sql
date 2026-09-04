-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('EXCEL', 'WORD', 'PDF', 'TEMPLATE', 'GUIDE', 'REPORT');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('INSIGHT', 'RESOURCE', 'TOOL', 'SERVICE', 'CASE_STUDY', 'PROJECT');

-- CreateTable
CREATE TABLE "DesignTokens" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "colors" JSONB NOT NULL DEFAULT '{}',
    "typography" JSONB NOT NULL DEFAULT '{}',
    "shape" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL DEFAULT '',
    "labelAr" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloatingAction" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'whatsapp',
    "labelEn" TEXT NOT NULL DEFAULT '',
    "labelAr" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FloatingAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ResourceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "summaryAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "type" "ResourceType" NOT NULL DEFAULT 'PDF',
    "categoryId" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "fileKey" TEXT,
    "fileName" TEXT NOT NULL DEFAULT '',
    "fileMime" TEXT NOT NULL DEFAULT '',
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "externalUrl" TEXT NOT NULL DEFAULT '',
    "thumbnail" TEXT,
    "includes" JSONB NOT NULL DEFAULT '[]',
    "audience" JSONB NOT NULL DEFAULT '[]',
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "summaryAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "purposeEn" TEXT NOT NULL DEFAULT '',
    "purposeAr" TEXT NOT NULL DEFAULT '',
    "config" JSONB NOT NULL DEFAULT '{}',
    "thumbnail" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentLink" (
    "id" TEXT NOT NULL,
    "fromType" "ContentType" NOT NULL,
    "fromId" TEXT NOT NULL,
    "toType" "ContentType" NOT NULL,
    "toId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialLink_enabled_order_idx" ON "SocialLink"("enabled", "order");

-- CreateIndex
CREATE INDEX "FloatingAction_enabled_order_idx" ON "FloatingAction"("enabled", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceCategory_slug_key" ON "ResourceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_status_order_idx" ON "Resource"("status", "order");

-- CreateIndex
CREATE INDEX "Resource_type_status_idx" ON "Resource"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE INDEX "Tool_status_order_idx" ON "Tool"("status", "order");

-- CreateIndex
CREATE INDEX "ContentLink_fromType_fromId_idx" ON "ContentLink"("fromType", "fromId");

-- CreateIndex
CREATE INDEX "ContentLink_toType_toId_idx" ON "ContentLink"("toType", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentLink_fromType_fromId_toType_toId_key" ON "ContentLink"("fromType", "fromId", "toType", "toId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ResourceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

