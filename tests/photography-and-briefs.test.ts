import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { LIBRARY_STARTERS } from '../src/lib/library-selection';
import { LIBRARY_ASSETS } from '../scripts/content/library-assets.mjs';
import photos from '../scripts/photographic-media.json';

describe('photographic public presentation and compact downloads', () => {
  it('uses committed photographs with traceable source and licence metadata', () => {
    expect(photos.length).toBeGreaterThanOrEqual(10);
    for (const photo of photos) {
      expect(photo.kind).toBe('photograph');
      expect(photo.sourceUrl).toMatch(/^https:\/\/www\.pexels\.com\/photo\//);
      expect(photo.licenseUrl).toBe('https://www.pexels.com/license/');
      expect(photo).not.toHaveProperty('prompt');
      expect(existsSync(path.join('public', photo.url))).toBe(true);
      expect(photo.width).toBeGreaterThanOrEqual(700);
      expect(photo.height).toBeGreaterThanOrEqual(500);
    }
  });

  it('offers a small starter collection with three distinct worked example files', () => {
    expect(LIBRARY_STARTERS).toHaveLength(9);
    const samples = LIBRARY_STARTERS.filter(slug => slug.startsWith('sample-'));
    expect(samples).toHaveLength(3);
    const files = samples.map(slug => readFileSync(`resources/library/pdf/${slug}.pdf`));
    expect(new Set(files.map(file => file.toString('base64'))).size).toBe(3);
    for (const slug of LIBRARY_STARTERS.filter(slug => !slug.startsWith('sample-'))) {
      expect(LIBRARY_ASSETS.some(asset => asset.slug === slug), slug).toBe(true);
    }
  });

  it('embeds the original logo in every editable bundled document', () => {
    for (const asset of LIBRARY_ASSETS.filter(asset => asset.type !== 'PDF')) {
      const names = execFileSync('unzip', ['-Z1', asset.sourcePath], { encoding: 'utf8' });
      expect(names, asset.sourcePath).toMatch(/(?:xl|word)\/media\/image[^\n]+/);
    }
    expect(readFileSync('public/brand/noriva-original.jpg').subarray(0, 2).toString('hex')).toBe('ffd8');
  });
});
