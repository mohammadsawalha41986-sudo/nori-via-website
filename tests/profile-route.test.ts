import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

const BASE = 'https://norivaglobal.com';
const run = (pathname: string) => middleware(new NextRequest(new URL(pathname, BASE)));

describe('client profile route', () => {
  it('serves /profile from the static profile page instead of a locale redirect', () => {
    const res = run('/profile');
    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('x-middleware-rewrite')).toBe(`${BASE}/profile/index.html`);
  });

  it('serves /profile/ the same way', () => {
    expect(run('/profile/').headers.get('x-middleware-rewrite')).toBe(`${BASE}/profile/index.html`);
  });

  it('lets the profile assets through untouched', () => {
    for (const asset of ['/profile/og-image.png', '/profile/favicon.png', '/profile/index.html']) {
      const res = run(asset);
      expect(res.headers.get('location')).toBeNull();
      expect(res.headers.get('x-middleware-rewrite')).toBeNull();
    }
  });

  it('still locale-redirects other unprefixed paths', () => {
    const res = run('/profiles');
    expect(res.headers.get('location')).toMatch(/\/(ar|en)\/profiles$/);
  });

  it('ships the page and every asset its link preview and icons point to', () => {
    const dir = path.resolve(import.meta.dirname, '../public/profile');
    const html = readFileSync(path.join(dir, 'index.html'), 'utf8');
    expect(html).toContain('<link rel="canonical" href="https://norivaglobal.com/profile">');
    for (const file of ['og-image.png', 'favicon.png', 'apple-touch-icon.png']) {
      expect(html).toContain(`/profile/${file}`);
      expect(existsSync(path.join(dir, file))).toBe(true);
    }
  });

  it('ships every local file the page references (photos, posts, srcset candidates)', () => {
    const dir = path.resolve(import.meta.dirname, '../public/profile');
    const html = readFileSync(path.join(dir, 'index.html'), 'utf8');
    const refs = new Set(html.match(/\/profile\/[\w./-]+\.(?:webp|png|jpe?g|svg|avif)/g) ?? []);
    expect(refs.size).toBeGreaterThan(3);
    const missing = [...refs].filter((ref) => !existsSync(path.join(dir, ref.slice('/profile/'.length))));
    expect(missing).toEqual([]);
  });

  it('shares the canonical profile URL from every share link', () => {
    const html = readFileSync(path.resolve(import.meta.dirname, '../public/profile/index.html'), 'utf8');
    const encoded = encodeURIComponent('https://norivaglobal.com/profile');
    for (const target of ['https://wa.me/?text=', 'https://t.me/share/url?', 'https://x.com/intent/post?', 'https://www.linkedin.com/sharing/share-offsite/?', 'mailto:?']) {
      const href = html.match(new RegExp(`href="(${target.replace(/[.?/]/g, '\\$&')}[^"]*)"`))?.[1];
      expect(href, target).toBeDefined();
      expect(href).toContain(encoded);
    }
    expect(html).toContain('data-copy="https://norivaglobal.com/profile"');
  });
});
