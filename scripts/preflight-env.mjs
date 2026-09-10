/**
 * Boot-time check that the deployment has the configuration it needs.
 *
 * Without this the failure mode is silent and worse than a crash: with no
 * DATABASE_URL every step of `start:production` fails into its `|| echo`
 * fallback, `next start` comes up anyway, and Railway marks the deployment
 * healthy while every page answers 500. The site looks deployed and is not.
 *
 * Exiting non-zero here instead means the new deployment never becomes
 * healthy, so Railway keeps the previous, working one serving traffic. A
 * configuration mistake costs a failed deploy rather than an outage.
 *
 * It prints names and verdicts only — never a value, not even a truncated or
 * masked one, because these are database credentials and signing secrets and
 * deployment logs are not a place to put them.
 */

/** Missing one of these means the deployment cannot serve the site at all. */
const REQUIRED = [
  {
    name: 'DATABASE_URL',
    why: 'Prisma reads it from prisma/schema.prisma; without it no page can render.',
  },
  {
    name: 'AUTH_SECRET',
    why: 'Signs admin sessions. Must be at least 32 characters.',
    valid: (value) => value.length >= 32,
    invalid: 'set but shorter than the 32 characters required',
  },
];

/**
 * Absent these the site still serves, so they are reported and not enforced.
 * `NEXT_PUBLIC_SITE_URL` is deliberately not required: `resolveSiteUrl` falls
 * back to the canonical domain, which is the correct value anyway.
 */
const RECOMMENDED = [
  { name: 'NEXT_PUBLIC_SITE_URL', why: 'falls back to the canonical domain' },
  { name: 'STORAGE_DIR', why: 'uploads fall back to ./storage instead of the mounted volume' },
  { name: 'SMTP_HOST', why: 'contact and inquiry email will not send' },
  { name: 'SMTP_PORT', why: 'contact and inquiry email will not send' },
  { name: 'SMTP_USER', why: 'contact and inquiry email will not send' },
  { name: 'SMTP_PASSWORD', why: 'contact and inquiry email will not send' },
];

const read = (name) => (process.env[name] ?? '').trim();

const failures = REQUIRED.flatMap((entry) => {
  const value = read(entry.name);
  if (!value) return [`${entry.name} is missing — ${entry.why}`];
  if (entry.valid && !entry.valid(value)) return [`${entry.name} is ${entry.invalid} — ${entry.why}`];
  return [];
});

const warnings = RECOMMENDED.filter((entry) => !read(entry.name)).map(
  (entry) => `${entry.name} is not set — ${entry.why}`,
);

for (const warning of warnings) console.warn(`[preflight] warning: ${warning}`);

if (failures.length) {
  for (const failure of failures) console.error(`[preflight] FATAL: ${failure}`);
  console.error(
    `[preflight] refusing to start: ${failures.length} required variable(s) missing or invalid.\n` +
      '[preflight] The previous deployment keeps serving. Restore the variables on the\n' +
      '[preflight] Railway service and redeploy — do not remove this check to get past it.',
  );
  process.exit(1);
}

console.log(
  `[preflight] ok: ${REQUIRED.map((entry) => entry.name).join(', ')} present` +
    (warnings.length ? ` · ${warnings.length} optional variable(s) unset` : ''),
);
