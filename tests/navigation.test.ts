import { describe, expect, it } from 'vitest';
import { navigationSchema, isKnownInternalRoute } from '../src/lib/validation';

const base = { labelEn: 'Library', labelAr: 'المكتبة', location: 'header' as const, order: 1, visible: true };

describe('navigation link validation', () => {
  it('accepts the site’s real routes', () => {
    for (const href of ['/', '/library', '/tools', '/start-here', '/insights/menu-costing', '/services/brand']) {
      expect(navigationSchema.safeParse({ ...base, href, external: false }).success).toBe(true);
    }
  });

  it('refuses an internal link that would 404', () => {
    const result = navigationSchema.safeParse({ ...base, href: '/liibrary', external: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toContain('404');
  });

  it('refuses a bare detail prefix with no slug', () => {
    expect(isKnownInternalRoute('/insights/')).toBe(false);
    expect(isKnownInternalRoute('/insights/a-slug')).toBe(true);
  });

  it('requires a scheme on external links, and a slash on internal ones', () => {
    expect(navigationSchema.safeParse({ ...base, href: 'instagram.com', external: true }).success).toBe(false);
    expect(navigationSchema.safeParse({ ...base, href: 'https://instagram.com', external: true }).success).toBe(true);
    expect(navigationSchema.safeParse({ ...base, href: 'about', external: false }).success).toBe(false);
  });

  it('ignores query strings and fragments when matching a route', () => {
    expect(navigationSchema.safeParse({ ...base, href: '/library?type=EXCEL', external: false }).success).toBe(true);
  });
});
