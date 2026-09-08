import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { LIBRARY_ASSETS } from '../scripts/content/library-assets.mjs';

const root = process.cwd();

describe('bundled Library resources', () => {
  it('ships the requested 35 XLSX, 15 DOCX and 10 PDF files', () => {
    const counts = LIBRARY_ASSETS.reduce<Record<string, number>>((all, asset) => {
      all[asset.type] = (all[asset.type] || 0) + 1;
      return all;
    }, {});
    expect(LIBRARY_ASSETS).toHaveLength(60);
    expect(counts).toEqual({ EXCEL: 35, WORD: 15, PDF: 10 });
  });

  it('has unique, bilingual and complete catalogue metadata', () => {
    expect(new Set(LIBRARY_ASSETS.map((asset) => asset.slug)).size).toBe(60);
    expect(new Set(LIBRARY_ASSETS.map((asset) => asset.sourcePath)).size).toBe(60);

    for (const asset of LIBRARY_ASSETS) {
      expect(asset.slug).toMatch(/^[a-z0-9-]+$/);
      expect(asset.titleEn.length).toBeGreaterThan(5);
      expect(asset.titleAr).toMatch(/[\u0600-\u06ff]/);
      expect(asset.summaryEn.length).toBeGreaterThan(40);
      expect(asset.summaryAr).toMatch(/[\u0600-\u06ff]/);
      expect(asset.descriptionEn.length).toBeGreaterThan(asset.summaryEn.length);
      expect(asset.descriptionAr).toMatch(/[\u0600-\u06ff]/);
      expect(asset.includes).toHaveLength(3);
      expect(asset.audience).toHaveLength(2);
    }
  });

  it('contains real, non-empty files with the expected document signatures', () => {
    for (const asset of LIBRARY_ASSETS) {
      const file = path.resolve(root, asset.sourcePath);
      expect(existsSync(file), asset.sourcePath).toBe(true);
      expect(statSync(file).size, asset.sourcePath).toBeGreaterThan(1_000);
      const prefix = readFileSync(file).subarray(0, 4).toString('latin1');
      expect(prefix, asset.sourcePath).toBe(asset.type === 'PDF' ? '%PDF' : 'PK\x03\x04');
    }
  });

  it('contains no spreadsheet formula error literals', () => {
    for (const asset of LIBRARY_ASSETS.filter((item) => item.type === 'EXCEL')) {
      const file = path.resolve(root, asset.sourcePath);
      const xml = execFileSync('unzip', ['-p', file], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
      expect(xml, asset.sourcePath).not.toMatch(/#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!)/);
    }
  });
});
