import { describe, expect, it } from 'vitest';
import { tokensToCss, resolveTokens, hexToChannels } from '../src/lib/design-tokens';
import { evaluateFormula, FormulaError, parseToolConfig } from '../src/lib/tool-engine';
import { resolveKey, sniffMime, safeDisplayName, RESOURCE_MIME } from '../src/lib/storage';

process.env.STORAGE_DIR = './storage';

describe('design tokens are not an injection vector', () => {
  it('never emits an unvalidated value into the stylesheet', () => {
    const hostile = resolveTokens({
      colors: { brand: '</style><script>alert(1)</script>', ink: 'red; background: url(javascript:alert(1))' },
      typography: { baseSize: '18px; } body { display: none' },
      shape: { radiusCard: 'expression(alert(1))' },
    });

    const css = tokensToCss(hostile);
    expect(css).not.toContain('<');
    expect(css).not.toContain('script');
    expect(css).not.toContain('javascript');
    expect(css).not.toContain('expression');
    // The hostile values are dropped, so the shipped defaults survive.
    expect(hostile.colors.brand).toBe('#F5106E');
    expect(hostile.typography.baseSize).toBe(17);
  });

  it('emits only channel triples for colours', () => {
    expect(hexToChannels('#F5106E')).toBe('245 16 110');
    expect(hexToChannels('rgb(0,0,0)')).toBeNull();
    expect(hexToChannels('#fff; }')).toBeNull();
  });

  it('produces valid CSS for an accepted override', () => {
    const css = tokensToCss(resolveTokens({ colors: { brand: '#1E9E6A' }, typography: {}, shape: {} }));
    expect(css).toBe(':root{--c-brand-500:30 158 106}');
  });
});

describe('tool formulas cannot reach the runtime', () => {
  it('rejects every escape attempt as a parse error', () => {
    const attempts = [
      'constructor', 'this', 'globalThis', 'process', 'require("fs")',
      '__proto__', 'toString.constructor("return 1")()', 'a[0]',
      'import("fs")', '`${1}`', 'x = 1', 'covers; process.exit(1)',
    ];
    for (const attempt of attempts) {
      expect(() => evaluateFormula(attempt, { covers: 1 }), attempt).toThrow(FormulaError);
    }
  });

  it('keeps prototype properties out of the function and constant tables', () => {
    expect(() => evaluateFormula('hasOwnProperty(1)', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('valueOf', {})).toThrow(FormulaError);
  });

  it('ignores prototype keys arriving through the scope object', () => {
    const scope = Object.create({ inherited: 42 }) as Record<string, number>;
    scope.own = 1;
    expect(evaluateFormula('own', scope)).toBe(1);
    expect(() => evaluateFormula('inherited', scope)).toThrow(FormulaError);
  });

  it('discards a stored config that is not a valid tool', () => {
    expect(parseToolConfig({ outputs: [{ expression: 'process.exit(1)' }] }).outputs).toEqual([]);
  });
});

describe('file handling', () => {
  it('refuses storage keys that escape their scope', () => {
    expect(() => resolveKey('private', '../../etc/passwd')).toThrow();
    expect(() => resolveKey('private', '/etc/passwd')).toThrow();
    expect(() => resolveKey('public', '..%2f..%2fetc')).not.toThrow(); // literal name, stays inside
  });

  it('accepts only document types for library resources', () => {
    expect(RESOURCE_MIME).not.toContain('text/html');
    expect(RESOURCE_MIME).not.toContain('image/svg+xml');
    expect(RESOURCE_MIME).not.toContain('application/x-msdownload');
  });

  it('refuses a script disguised as a document', () => {
    const html = Buffer.from('<html><script>alert(1)</script></html>'.padEnd(64, ' '));
    const elf = Buffer.concat([Buffer.from([0x7f, 0x45, 0x4c, 0x46]), Buffer.alloc(32)]);
    expect(sniffMime(html)).toBeNull();
    expect(sniffMime(elf)).toBeNull();
  });

  it('strips path separators from a display filename', () => {
    expect(safeDisplayName('../../etc/passwd')).toBe('passwd');
    expect(safeDisplayName('C:\\Windows\\evil.exe')).toBe('evil.exe');
  });
});
