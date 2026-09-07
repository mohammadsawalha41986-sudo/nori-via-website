-- Footer backdrop controls: where the background image is anchored, and the
-- overlay drawn over it so the type stays readable.
CREATE TYPE "FooterBackgroundPosition" AS ENUM ('CENTER', 'TOP', 'BOTTOM', 'LEFT', 'RIGHT');

ALTER TABLE "SiteSettings"
  ADD COLUMN "footerBackgroundPosition" "FooterBackgroundPosition" NOT NULL DEFAULT 'CENTER',
  ADD COLUMN "footerOverlayColor" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "footerOverlayOpacity" INTEGER NOT NULL DEFAULT 80;
