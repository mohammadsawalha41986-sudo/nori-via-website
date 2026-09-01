# Noriva — Company Website & CMS

The public website for **Noriva**, a restaurant-specialised creative and growth
company, together with the private CMS that runs it.

The site exists to present the company, explain its services, show its work,
build trust and **capture leads**. When someone submits a project inquiry it is
stored and emailed to the Noriva team, who then continue the conversation by
email, phone or WhatsApp. The actual client work happens outside this system.

This is deliberately **not** a project-management platform, a client portal, a
CRM, an invoicing system or a SaaS product, and it has no connection to Rawaj.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) · React 19 · TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Styling | Tailwind CSS 3 with a Noriva design system |
| Auth | Custom sessions — bcrypt hashes, signed JWT cookie, DB-backed revocation |
| Email | Nodemailer over SMTP |
| Storage | Local filesystem, split into public and private scopes |
| Motion | CSS transitions driven by IntersectionObserver + scroll progress |
| Tests | Vitest (unit) · Playwright (end-to-end admin journey) |

No animation library ships to the browser: entrances, the scroll-lit brand
statement and the magnetic buttons are all hand-rolled, which keeps the public
bundle at roughly 103 kB shared JS.

---

## Rendering and caching

Every public page reads CMS content from PostgreSQL, so **no CMS-backed page is
prerendered during `next build`**. There is deliberately no `generateStaticParams`
for locales, service slugs, project slugs or article slugs: enumerating them
would require a live database just to compile the app, and would bake content
into the build.

Instead each page is rendered on first request and then cached for its
`revalidate` window (60s for content pages, 300s for the near-static ones, one
hour for the sitemap). Publishing from Admin calls `revalidatePath` for the
concrete paths affected in both languages, so a change is live immediately
rather than after the window expires.

The practical consequences:

- `npm run build` succeeds with **no** `DATABASE_URL` set.
- `DATABASE_URL` is required at runtime, and for `prisma migrate deploy`.
- An empty database is a valid state: pages render honest empty states, unknown
  slugs 404, and nothing crashes.

## Getting started

```bash
npm install
cp .env.example .env          # then fill in DATABASE_URL, AUTH_SECRET, ADMIN_*
npx prisma migrate deploy     # create the schema
npm run db:seed               # services, categories, pages, navigation, admin user
npm run dev
```

- Public site: <http://localhost:3000> (redirects to `/en` or `/ar`)
- Admin: <http://localhost:3000/admin>

`AUTH_SECRET` must be at least 32 characters — the app refuses to start a
session without it. Generate one with `openssl rand -base64 48`.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed baseline content and the first admin user |

---

## What the seed creates

Real, usable structure — and nothing invented:

- 28 services across 5 practice categories, written in English and Arabic
- Work and insight categories
- The four Noriva System stages
- Header and footer navigation
- Editable page content for About, Restaurant Growth, Services, Work, Insights,
  Contact, Start a Project, Privacy and Terms
- Homepage hero, brand statement, restaurant-intelligence and CTA copy
- One owner account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

It deliberately creates **no** portfolio projects, case studies, statistics or
testimonials. Those describe real clients and real results, so they stay empty
until someone enters genuine data. The public Work page shows an honest empty
state rather than invented case studies.

The Privacy and Terms pages ship as clearly-marked placeholders. Replace them
with reviewed copy from Admin → Pages before launch.

---

## Public site

| Route | Notes |
| --- | --- |
| `/[locale]` | Hero, brand statement, Noriva System, selected work, restaurant intelligence, statistics, featured case study, services, CTA |
| `/[locale]/about` | Who we are, beliefs, thinking, approach, restaurant expertise |
| `/[locale]/services` | Editorial index grouped by practice |
| `/[locale]/services/[slug]` | What we do → why it matters → approach → what you get → work → proof → FAQ → CTA |
| `/[locale]/work` | Filterable portfolio, client-side and instant |
| `/[locale]/work/[slug]` | Project plus its full case-study narrative |
| `/[locale]/restaurant-growth` | Positioning page: menu, pricing, food cost, operations, profitability |
| `/[locale]/insights` and `/[locale]/insights/[slug]` | Editorial articles |
| `/[locale]/contact` | Contact details and a message form |
| `/[locale]/start-a-project` | The seven-step inquiry form |
| `/[locale]/privacy`, `/[locale]/terms` | Editable legal pages |
| `/sitemap.xml`, `/robots.txt` | Generated from published content |

`locale` is `en` or `ar`. Middleware redirects `/` to the visitor's preferred
language, remembering an explicit choice in a cookie. Arabic renders right to
left with its own typeface, and an untranslated field falls back to the other
language rather than rendering blank.

---

## Admin CMS

Everything lives under `/admin`, which is session-protected, `noindex`, and
excluded in `robots.txt`.

| Section | What it manages |
| --- | --- |
| Dashboard | Content counts, recent inquiries, a setup checklist |
| Inquiries | Lead inbox — New / Contacted / Completed / Archived, notes, attachments |
| Contact messages | Messages from the contact page |
| Homepage | Hero, statement, system headline, intelligence, featured case study, CTA |
| Noriva System | The four storytelling stages |
| Services · Portfolio · Case studies · Insights | Full CRUD, draft/publish, reorder, delete |
| Pages | Headline, body and section content for the fixed pages |
| Media | Upload, search, filter, preview, alt text, delete |
| Statistics · Testimonials | Hidden until explicitly marked visible |
| Categories | Service, work and insight taxonomies |
| Site settings · Navigation · SEO | Company, contact, social, footer, links, metadata, analytics |

Saving publishes immediately: each action revalidates the concrete public paths
it affects, in both languages.

Deletions require confirmation and explain what else is touched. Removing a
category leaves its content in place and simply uncategorised; deleting a
project keeps any case study but unlinks it.

---

## Lead intake

```
Visitor → seven-step form → server validation → stored in PostgreSQL
                                              → attachments to private storage
                                              → email to the Noriva team
                                              → confirmation email to the client
```

The inquiry is saved **before** any email is attempted, so a mail outage never
loses a lead. Each inquiry records whether both emails were sent, and Admin
shows that status. With `SMTP_HOST` unset the form still works end to end;
inquiries simply wait in the inbox.

### Brand assets and the logo

The logo, the dark-background logo, the favicon and the social share image are
all uploaded in **Admin → Site settings** and used immediately across the
public site — desktop navbar, mobile navbar, footer, favicon, and the
`og:image` / `twitter:image` share card.

Uploaded artwork is never recoloured, cropped or redrawn. It is only scaled,
always with its aspect ratio preserved:

- **Logo** — used wherever the background is light (the scrolled navbar).
- **Logo for dark backgrounds** — optional. Used over the dark hero navbar and
  the footer. Upload a light/reversed version here if the brand has one.
- If only one logo version exists, the original artwork is placed on a white
  plate over dark sections rather than being altered. Nothing about the file
  is changed.

Recommended formats: **PNG or WEBP** at roughly 3× the display size (about
450×108 for the wordmark, 512×512 for the favicon). SVG upload is deliberately
not accepted — an SVG served from the site's own origin can carry script, so
the media library allows only raster images, PDF and video.

The favicon is driven entirely from Admin. The file-based Next.js icon
convention is intentionally not used, because it silently overrides metadata
and would make the favicon uneditable; the bundled default in `public/` is only
a fallback for when nothing has been uploaded.

### Upload safety

Client attachments accept JPG, PNG, WEBP and PDF only, up to 8 files of 10 MB
each. Every file is checked three ways:

1. The declared MIME type must be on the allowlist.
2. The **leading bytes are sniffed** and must match the declared type — a
   renamed executable is rejected even if it claims to be `image/png`.
3. The stored filename is random; the client's name is kept for display only,
   with path separators stripped.

Attachments are written to `STORAGE_DIR/private`, served only to a signed-in
admin, and always with `Content-Disposition: attachment` so untrusted content
never renders in the browser. Path resolution refuses anything that escapes the
scope root.

Media-library files go to `STORAGE_DIR/public` and are only served when a
matching `Media` row exists, so the directory cannot be probed.

### Spam and abuse

- A honeypot field: submissions that fill it get a success response and are
  discarded.
- Rate limits per IP: 3 inquiries/hour, 5 contact messages/hour, 8 login
  attempts per 15 minutes.
- Login errors never reveal whether an address exists.

---

## Security notes

- Passwords are bcrypt hashed at cost 12 and never logged.
- Sessions are a signed JWT cookie (`httpOnly`, `sameSite=lax`, `secure` in
  production) whose id is stored **hashed** in the database, so a database leak
  cannot be replayed as a login. Signing out deletes the row.
- Every admin server action and API route re-checks the session; the layout
  guard is not the only gate.
- All CMS input is validated with Zod on the server, with explicit length caps.
- CMS text is rendered as React children, never as HTML, so authored content
  cannot inject markup. The only `dangerouslySetInnerHTML` is JSON-LD built
  from `JSON.stringify` with `<` escaped.
- `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` are set for
  every response; `/admin` additionally sends `X-Robots-Tag: noindex`.

---

## Testing

```bash
npm test                            # 44 unit tests

# End-to-end suites, against a running server
npm run build && npm start &
export ADMIN_EMAIL=... ADMIN_PASSWORD=...
node tests/e2e/public-qa.mjs           # every public page at 3 widths: layout, a11y, metadata
node tests/e2e/admin-route-sweep.mjs   # all 22 CMS screens render cleanly
node tests/e2e/admin-journey.mjs       # 22 checks: sign in → publish → verify → sign out
node tests/e2e/branding-journey.mjs    # 27 checks: logo, favicon, contact details, socials
```

The journey needs Playwright (`npm i -D playwright && npx playwright install
chromium`). Set `CHROMIUM_PATH` to reuse a browser the environment already
provides, and `BASE_URL` to point at somewhere other than localhost:3000.

The unit tests cover upload sniffing and path-escape defence, filename
sanitising, bilingual field fallback, inquiry/contact/login validation, and the
Admin list parsers.

The end-to-end suites cover what unit tests cannot: `public-qa` loads every
public page at desktop, tablet and mobile widths and fails on horizontal
overflow, a wrong text direction, a missing or duplicated `h1`, images without
alt text or that failed to load, unlabelled form controls, missing
title/description/canonical/favicon, any 5xx or any client-side error;
`admin-route-sweep` loads
every CMS screen and fails on any non-200 or client-side error; `admin-journey`
signs in, edits the homepage, creates, publishes and unpublishes a service,
verifies each change on the public site in both languages, and checks the
inquiry inbox and attachment access control; `branding-journey` uploads brand
artwork, sets it plus the contact details from Admin, and asserts the live site
picks all of it up in English and Arabic.

---

## Deployment (Hostinger)

Requires Node.js 20+ (built and verified on 22) and a PostgreSQL 14+ database.

**Build and run**

```bash
npm ci
npx prisma migrate deploy
npm run build
npm start            # serves on PORT, default 3000
```

Point the Node application entry at `npm start` and put Nginx or the Hostinger
proxy in front of it with SSL for `noriva.sa` and `www.noriva.sa`.

**Checklist**

1. Create the PostgreSQL database and set `DATABASE_URL`.
2. Set `AUTH_SECRET` to a fresh 32+ character random value.
3. Set `NEXT_PUBLIC_SITE_URL=https://noriva.sa`.
4. Configure SMTP, or leave `SMTP_HOST` empty and collect leads from Admin.
5. Point `STORAGE_DIR` at a **persistent, writable** directory outside the
   deploy folder, so uploads survive redeploys. Back it up with the database.
6. Run `npm run db:seed` once, sign in, change the admin password, then clear
   `ADMIN_PASSWORD` from the environment.
7. DNS: `A`/`CNAME` for `noriva.sa` and `www.noriva.sa`; issue SSL for both.
8. In Admin → Site settings, add the logo, contact details and social links.

`.env` is git-ignored and must never be committed.

---

## Project layout

```
public/                     Fallback favicon and icon (overridden by the CMS)
prisma/schema.prisma        Data model
prisma/seed.ts              Baseline content and first admin user
src/app/[locale]/           Public pages (en + ar)
src/app/admin/login/        Sign-in, outside the protected layout
src/app/admin/(protected)/  Session-guarded CMS
src/app/api/                Inquiry, contact and admin media/attachment routes
src/app/media/[...key]/     Public media delivery
src/components/public/      Site components
src/components/admin/       CMS components
src/lib/                    db, auth, i18n, storage, mail, validation, seo
src/server/actions.ts       All CMS mutations
tests/                      Vitest suites
```
