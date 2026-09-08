-- Homepage question blocks, services showcase and image banner.
-- Both question blocks share one table: the fields are identical and only the
-- presentation differs, so "group" selects which block a row belongs to.
CREATE TYPE "HomepageFaqGroup" AS ENUM ('NUMBERED', 'ACCORDION');

CREATE TABLE "HomepageFaq" (
  "id"         TEXT NOT NULL,
  "group"      "HomepageFaqGroup" NOT NULL DEFAULT 'ACCORDION',
  "questionEn" TEXT NOT NULL,
  "questionAr" TEXT NOT NULL DEFAULT '',
  "answerEn"   TEXT NOT NULL DEFAULT '',
  "answerAr"   TEXT NOT NULL DEFAULT '',
  "order"      INTEGER NOT NULL DEFAULT 0,
  "visible"    BOOLEAN NOT NULL DEFAULT true,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HomepageFaq_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HomepageFaq_group_visible_order_idx" ON "HomepageFaq"("group", "visible", "order");

ALTER TABLE "HomepageContent"
  ADD COLUMN "questionsEyebrowEn"  TEXT NOT NULL DEFAULT '',
  ADD COLUMN "questionsEyebrowAr"  TEXT NOT NULL DEFAULT '',
  ADD COLUMN "questionsHeadlineEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "questionsHeadlineAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "questionsBodyEn"     TEXT NOT NULL DEFAULT '',
  ADD COLUMN "questionsBodyAr"     TEXT NOT NULL DEFAULT '',
  ADD COLUMN "faqEyebrowEn"        TEXT NOT NULL DEFAULT '',
  ADD COLUMN "faqEyebrowAr"        TEXT NOT NULL DEFAULT '',
  ADD COLUMN "faqHeadlineEn"       TEXT NOT NULL DEFAULT '',
  ADD COLUMN "faqHeadlineAr"       TEXT NOT NULL DEFAULT '',
  ADD COLUMN "faqBodyEn"           TEXT NOT NULL DEFAULT '',
  ADD COLUMN "faqBodyAr"           TEXT NOT NULL DEFAULT '',
  ADD COLUMN "servicesHeadlineEn"  TEXT NOT NULL DEFAULT '',
  ADD COLUMN "servicesHeadlineAr"  TEXT NOT NULL DEFAULT '',
  ADD COLUMN "servicesBodyEn"      TEXT NOT NULL DEFAULT '',
  ADD COLUMN "servicesBodyAr"      TEXT NOT NULL DEFAULT '',
  ADD COLUMN "featuredServiceId"   TEXT,
  ADD COLUMN "bannerEyebrowEn"     TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerEyebrowAr"     TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerHeadlineEn"    TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerHeadlineAr"    TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerBodyEn"        TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerBodyAr"        TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerCtaLabelEn"    TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerCtaLabelAr"    TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerCtaHref"       TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bannerImageUrl"      TEXT;
