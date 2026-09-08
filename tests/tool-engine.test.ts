import { describe, expect, it } from 'vitest';
import {
  evaluateFormula,
  computeOutputs,
  checkFormula,
  formatOutput,
  parseToolConfig,
  FormulaError,
  type ToolConfig,
} from '../src/lib/tool-engine';
import { NEW_TOOLS } from '../scripts/content/tools.mjs';

describe('evaluateFormula', () => {
  it('applies arithmetic precedence', () => {
    expect(evaluateFormula('2 + 3 * 4', {})).toBe(14);
    expect(evaluateFormula('(2 + 3) * 4', {})).toBe(20);
    expect(evaluateFormula('10 - 4 - 3', {})).toBe(3);
  });

  it('treats exponentiation as right associative', () => {
    expect(evaluateFormula('2 ^ 3 ^ 2', {})).toBe(512);
    expect(evaluateFormula('-2 ^ 2', {})).toBe(-4);
  });

  it('resolves fields from the scope', () => {
    expect(evaluateFormula('price * quantity', { price: 12.5, quantity: 4 })).toBe(50);
  });

  it('supports comparisons and the conditional operator', () => {
    expect(evaluateFormula('revenue > cost ? 1 : 0', { revenue: 10, cost: 4 })).toBe(1);
    expect(evaluateFormula('revenue > cost ? 1 : 0', { revenue: 2, cost: 4 })).toBe(0);
  });

  it('supports the whitelisted functions and constants', () => {
    expect(evaluateFormula('round(10 / 3, 2)', {})).toBe(3.33);
    expect(evaluateFormula('max(1, 9, 4)', {})).toBe(9);
    expect(evaluateFormula('round(PI, 2)', {})).toBe(3.14);
  });

  it('rejects unknown fields rather than treating them as zero', () => {
    expect(() => evaluateFormula('missing + 1', {})).toThrow(FormulaError);
  });

  it('never reaches the JavaScript runtime', () => {
    // Any attempt to escape the grammar is a parse error, not an execution.
    expect(() => evaluateFormula('process.exit(1)', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('constructor', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('toString', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('globalThis', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('1; fetch("/x")', {})).toThrow(FormulaError);
  });

  it('rejects malformed expressions', () => {
    expect(() => evaluateFormula('2 +', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('(2 + 3', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('2 3', {})).toThrow(FormulaError);
    expect(() => evaluateFormula('round()', {})).toThrow(FormulaError);
  });
});

describe('computeOutputs', () => {
  const config = parseToolConfig({
    inputs: [
      { key: 'covers', labelEn: 'Covers', defaultValue: 100 },
      { key: 'spend', labelEn: 'Average spend', defaultValue: 40 },
      { key: 'foodCost', labelEn: 'Food cost %', defaultValue: 30 },
    ],
    outputs: [
      { key: 'revenue', labelEn: 'Revenue', expression: 'covers * spend' },
      { key: 'gross', labelEn: 'Gross profit', expression: 'revenue * (1 - foodCost / 100)' },
      { key: 'broken', labelEn: 'Broken', expression: 'nope * 2' },
      { key: 'divByZero', labelEn: 'Undefined', expression: '1 / 0' },
    ],
  }) as ToolConfig;

  it('feeds each result into the scope of the next output', () => {
    const results = computeOutputs(config, { covers: 100, spend: 40, foodCost: 30 });
    expect(results[0]).toEqual({ key: 'revenue', value: 4000, error: null });
    expect(results[1]).toEqual({ key: 'gross', value: 2800, error: null });
  });

  it('isolates a broken formula instead of failing the whole tool', () => {
    const results = computeOutputs(config, { covers: 100, spend: 40, foodCost: 30 });
    expect(results[2]?.value).toBeNull();
    expect(results[2]?.error).toContain('nope');
    expect(results[3]).toEqual({ key: 'divByZero', value: null, error: null });
  });
});

describe('checkFormula', () => {
  it('accepts a formula that only uses known keys', () => {
    expect(checkFormula('a + b', ['a', 'b'])).toBeNull();
  });

  it('names the offending field', () => {
    expect(checkFormula('a + c', ['a', 'b'])).toContain('c');
  });
});

describe('formatOutput', () => {
  it('formats currency, percentages and empty results', () => {
    expect(formatOutput(1234.5, { format: 'currency', precision: 2 }, 'en', 'SAR')).toBe('SAR 1,234.50');
    expect(formatOutput(12.345, { format: 'percent', precision: 1 }, 'en', '')).toBe('12.3%');
    expect(formatOutput(null, { format: 'number', precision: 0 }, 'en', '')).toBe('—');
  });
});

describe('parseToolConfig', () => {
  it('falls back to an empty tool when the stored config is unusable', () => {
    expect(parseToolConfig({ inputs: 'nonsense' }).inputs).toEqual([]);
    expect(parseToolConfig(null).outputs).toEqual([]);
  });
});

describe('provisioned calculator catalogue', () => {
  it('has valid bilingual configurations and working default calculations', () => {
    expect(NEW_TOOLS).toHaveLength(9);
    for (const tool of NEW_TOOLS) {
      const config = parseToolConfig(tool.config);
      expect(config.inputs.length, tool.slug).toBeGreaterThan(0);
      expect(config.outputs.length, tool.slug).toBeGreaterThan(0);
      expect(config.notesEn.length, tool.slug).toBeGreaterThan(20);
      expect(config.notesAr, tool.slug).toMatch(/[\u0600-\u06ff]/);
      const values = Object.fromEntries(config.inputs.map((input) => [input.key, input.defaultValue]));
      const outputs = computeOutputs(config, values);
      expect(outputs.every((output) => output.error === null && output.value !== null && Number.isFinite(output.value)), tool.slug).toBe(true);
    }
  });
});
