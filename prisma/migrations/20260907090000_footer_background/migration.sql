-- Footer backdrop: colour or full-bleed image, managed from Admin.
CREATE TYPE "FooterBackground" AS ENUM ('COLOR', 'IMAGE');

ALTER TABLE "SiteSettings"
  ADD COLUMN "footerBackgroundType" "FooterBackground" NOT NULL DEFAULT 'COLOR',
  ADD COLUMN "footerBackgroundImage" TEXT,
  ADD COLUMN "footerBackgroundColor" TEXT NOT NULL DEFAULT '';
