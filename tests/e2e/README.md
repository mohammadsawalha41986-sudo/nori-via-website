# End-to-end suites

Browser-driven checks that run against a built application and a real database.
They are kept in the repository rather than written per session, so a change
that breaks a flow is caught the same way twice.

    npm run build
    DATABASE_URL=… AUTH_SECRET=… npx prisma migrate deploy
    node scripts/ensure-content.mjs
    npm start &                       # or `next start -p 3000`
    node tests/e2e/platform.mjs       # design system, library, tools, relations
    node tests/e2e/fnb.mjs            # F&B positioning, menu service, intake
    node tests/e2e/sweep.mjs          # every route, a11y, responsive

They expect an admin account (`ADMIN_EMAIL` / `ADMIN_PASSWORD` when seeding)
and use `QA_EMAIL` / `QA_PASSWORD` / `QA_BASE_URL` to reach it, defaulting to
a local server on port 3000.
