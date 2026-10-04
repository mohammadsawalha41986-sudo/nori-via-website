# Arabic layout and public site verification — 2026-10-04

Starting repository commit: a5d4bc56a792d1504ca3301055f226745ee55406.
Existing SEO implementation and CMS content preserved.

## Changes

- Public section padding reduced from 96px mobile / 124.8px desktop to responsive 32–64px defaults. Existing CMS spacing overrides still apply through a viewport-aware clamp.
- Arabic display headings use a smaller responsive scale, improved line height, and zero tracking. Arabic secondary headings explicitly use the selected Arabic font.
- Arabic font-display uses swap so slower connections eventually receive the selected font rather than staying on an OS fallback. This may introduce a font swap on slow links; field CLS should be monitored.
- Homepage introduction aligned to the same shell as other sections, without narrow nested padding.
- Homepage service showcase limited to four cards. All services remain on the services page; mobile showcase uses a vertical grid.
- Pale brand hover colors removed from service headings and text links; problem links retain dark text.
- Homepage and internal page heroes have reduced vertical spacing; internal descriptions have stronger contrast.
- Public library description strips legacy editor instructions without changing unrelated CMS text. Default provisioning copy updated and Arabic brand spelling unified in resource covers and editorial alt text.
- Search remains crawlable so existing noindex directives can be read; admin/API exclusions preserved.

## Fresh evidence

- npm test: 15 files / 174 tests passed, including SEO readiness and existing calculation tests.
- npm run typecheck: passed.
- npm run build: passed, including Next's lint and type validation.
- git diff --check: passed.
- npm run test:seo against https://norivaglobal.com: 393 sitemap URLs, zero reported issues, zero broken internal URLs, zero duplicate titles, 110 share-image URLs checked with no broken images, unknown page HTTP 404.
- Live homepage: self canonical /ar, Arabic and English hreflang, one H1, six JSON-LD blocks.
- Live robots.txt and sitemap.xml: HTTP 200.

## Limits

The full live SEO crawl above ran before the new layout deployment. It verifies the existing SEO baseline, not a post-deployment visual acceptance test.
No production database credentials were accessed. Forms were not submitted to real recipients. Search Console/Bing account verification was not performed; configured tokens remain unchanged.
The available browser did not expose mobile viewport resizing. Responsive CSS has been implemented and the build verified, but 360/390/430px visual acceptance and measured post-change CLS remain unverified.
Original logo preserved; no artificial customer work, reviews, or results introduced.
