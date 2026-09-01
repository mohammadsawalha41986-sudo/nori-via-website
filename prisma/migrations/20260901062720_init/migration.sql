-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "companyNameEn" TEXT NOT NULL DEFAULT 'Noriva',
    "companyNameAr" TEXT NOT NULL DEFAULT 'نوريفا',
    "taglineEn" TEXT NOT NULL DEFAULT 'Restaurant · Creative · Growth',
    "taglineAr" TEXT NOT NULL DEFAULT 'مطاعم · إبداع · نمو',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "logoMarkUrl" TEXT,
    "faviconUrl" TEXT,
    "defaultOgImage" TEXT,
    "inquiryEmail" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "addressEn" TEXT NOT NULL DEFAULT '',
    "addressAr" TEXT NOT NULL DEFAULT '',
    "mapsUrl" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "tiktok" TEXT NOT NULL DEFAULT '',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "x" TEXT NOT NULL DEFAULT '',
    "youtube" TEXT NOT NULL DEFAULT '',
    "footerDescriptionEn" TEXT NOT NULL DEFAULT '',
    "footerDescriptionAr" TEXT NOT NULL DEFAULT '',
    "copyrightEn" TEXT NOT NULL DEFAULT '',
    "copyrightAr" TEXT NOT NULL DEFAULT '',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "gaId" TEXT NOT NULL DEFAULT '',
    "gtmId" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroEyebrowEn" TEXT NOT NULL DEFAULT '',
    "heroEyebrowAr" TEXT NOT NULL DEFAULT '',
    "heroHeadlineEn" TEXT NOT NULL DEFAULT '',
    "heroHeadlineAr" TEXT NOT NULL DEFAULT '',
    "heroSubtitleEn" TEXT NOT NULL DEFAULT '',
    "heroSubtitleAr" TEXT NOT NULL DEFAULT '',
    "heroPrimaryCtaEn" TEXT NOT NULL DEFAULT '',
    "heroPrimaryCtaAr" TEXT NOT NULL DEFAULT '',
    "heroSecondaryCtaEn" TEXT NOT NULL DEFAULT '',
    "heroSecondaryCtaAr" TEXT NOT NULL DEFAULT '',
    "heroMediaUrl" TEXT,
    "heroMediaKind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "statementEn" TEXT NOT NULL DEFAULT '',
    "statementAr" TEXT NOT NULL DEFAULT '',
    "statementSupportEn" TEXT NOT NULL DEFAULT '',
    "statementSupportAr" TEXT NOT NULL DEFAULT '',
    "systemHeadlineEn" TEXT NOT NULL DEFAULT '',
    "systemHeadlineAr" TEXT NOT NULL DEFAULT '',
    "intelligenceHeadlineEn" TEXT NOT NULL DEFAULT '',
    "intelligenceHeadlineAr" TEXT NOT NULL DEFAULT '',
    "intelligenceBodyEn" TEXT NOT NULL DEFAULT '',
    "intelligenceBodyAr" TEXT NOT NULL DEFAULT '',
    "intelligenceItems" JSONB NOT NULL DEFAULT '[]',
    "featuredCaseStudyId" TEXT,
    "ctaHeadlineEn" TEXT NOT NULL DEFAULT '',
    "ctaHeadlineAr" TEXT NOT NULL DEFAULT '',
    "ctaDescriptionEn" TEXT NOT NULL DEFAULT '',
    "ctaDescriptionAr" TEXT NOT NULL DEFAULT '',
    "ctaLabelEn" TEXT NOT NULL DEFAULT '',
    "ctaLabelAr" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemStage" (
    "id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "services" JSONB NOT NULL DEFAULT '[]',
    "mediaUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "categoryId" TEXT,
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "summaryAr" TEXT NOT NULL DEFAULT '',
    "heroHeadlineEn" TEXT NOT NULL DEFAULT '',
    "heroHeadlineAr" TEXT NOT NULL DEFAULT '',
    "heroDescriptionEn" TEXT NOT NULL DEFAULT '',
    "heroDescriptionAr" TEXT NOT NULL DEFAULT '',
    "whatWeDoEn" TEXT NOT NULL DEFAULT '',
    "whatWeDoAr" TEXT NOT NULL DEFAULT '',
    "whyItMattersEn" TEXT NOT NULL DEFAULT '',
    "whyItMattersAr" TEXT NOT NULL DEFAULT '',
    "approachEn" TEXT NOT NULL DEFAULT '',
    "approachAr" TEXT NOT NULL DEFAULT '',
    "deliverables" JSONB NOT NULL DEFAULT '[]',
    "process" JSONB NOT NULL DEFAULT '[]',
    "benefits" JSONB NOT NULL DEFAULT '[]',
    "faqs" JSONB NOT NULL DEFAULT '[]',
    "featuredImage" TEXT,
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "client" TEXT NOT NULL DEFAULT '',
    "categoryId" TEXT,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "heroMediaUrl" TEXT,
    "heroMediaKind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "videos" JSONB NOT NULL DEFAULT '[]',
    "downloads" JSONB NOT NULL DEFAULT '[]',
    "year" INTEGER,
    "location" TEXT NOT NULL DEFAULT '',
    "results" JSONB NOT NULL DEFAULT '[]',
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

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectService" (
    "projectId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ProjectService_pkey" PRIMARY KEY ("projectId","serviceId")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "projectId" TEXT,
    "challengeEn" TEXT NOT NULL DEFAULT '',
    "challengeAr" TEXT NOT NULL DEFAULT '',
    "strategyEn" TEXT NOT NULL DEFAULT '',
    "strategyAr" TEXT NOT NULL DEFAULT '',
    "ideaEn" TEXT NOT NULL DEFAULT '',
    "ideaAr" TEXT NOT NULL DEFAULT '',
    "creativeEn" TEXT NOT NULL DEFAULT '',
    "creativeAr" TEXT NOT NULL DEFAULT '',
    "campaignEn" TEXT NOT NULL DEFAULT '',
    "campaignAr" TEXT NOT NULL DEFAULT '',
    "resultEn" TEXT NOT NULL DEFAULT '',
    "resultAr" TEXT NOT NULL DEFAULT '',
    "outcomeEn" TEXT NOT NULL DEFAULT '',
    "outcomeAr" TEXT NOT NULL DEFAULT '',
    "metrics" JSONB NOT NULL DEFAULT '[]',
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "videos" JSONB NOT NULL DEFAULT '[]',
    "files" JSONB NOT NULL DEFAULT '[]',
    "heroMediaUrl" TEXT,
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyService" (
    "caseStudyId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "CaseStudyService_pkey" PRIMARY KEY ("caseStudyId","serviceId")
);

-- CreateTable
CREATE TABLE "InsightCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InsightCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL DEFAULT '',
    "excerptAr" TEXT NOT NULL DEFAULT '',
    "contentEn" TEXT NOT NULL DEFAULT '',
    "contentAr" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT,
    "categoryId" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "author" TEXT NOT NULL DEFAULT '',
    "publishedAt" TIMESTAMP(3),
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altEn" TEXT NOT NULL DEFAULT '',
    "altAr" TEXT NOT NULL DEFAULT '',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "quoteEn" TEXT NOT NULL,
    "quoteAr" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "rating" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'header',
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "external" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "titleAr" TEXT NOT NULL DEFAULT '',
    "bodyEn" TEXT NOT NULL DEFAULT '',
    "bodyAr" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL DEFAULT '{}',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
    "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
    "canonical" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "business" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "social" TEXT NOT NULL DEFAULT '',
    "services" JSONB NOT NULL DEFAULT '[]',
    "goals" JSONB NOT NULL DEFAULT '[]',
    "description" TEXT NOT NULL DEFAULT '',
    "budget" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "preferredContact" TEXT NOT NULL DEFAULT 'email',
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT NOT NULL DEFAULT '',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "ip" TEXT,
    "userAgent" TEXT,
    "emailSentToTeam" BOOLEAN NOT NULL DEFAULT false,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectInquiryAttachment" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectInquiryAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_status_order_idx" ON "Service"("status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCategory_slug_key" ON "WorkCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_order_idx" ON "Project"("status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_projectId_key" ON "CaseStudy"("projectId");

-- CreateIndex
CREATE INDEX "CaseStudy_status_order_idx" ON "CaseStudy"("status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "InsightCategory_slug_key" ON "InsightCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Insight_slug_key" ON "Insight"("slug");

-- CreateIndex
CREATE INDEX "Insight_status_publishedAt_idx" ON "Insight"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Media_kind_createdAt_idx" ON "Media"("kind", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Page_key_key" ON "Page"("key");

-- CreateIndex
CREATE INDEX "ProjectInquiry_status_createdAt_idx" ON "ProjectInquiry"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInquiryAttachment_storageKey_key" ON "ProjectInquiryAttachment"("storageKey");

-- CreateIndex
CREATE INDEX "ProjectInquiryAttachment_inquiryId_idx" ON "ProjectInquiryAttachment"("inquiryId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitHit_bucket_createdAt_idx" ON "RateLimitHit"("bucket", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_name_createdAt_idx" ON "AnalyticsEvent"("name", "createdAt");

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WorkCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectService" ADD CONSTRAINT "ProjectService_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectService" ADD CONSTRAINT "ProjectService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyService" ADD CONSTRAINT "CaseStudyService_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyService" ADD CONSTRAINT "CaseStudyService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InsightCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInquiryAttachment" ADD CONSTRAINT "ProjectInquiryAttachment_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "ProjectInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
