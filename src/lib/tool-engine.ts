import { z } from 'zod';

/**
 * Formula engine behind the Tools platform.
 *
 * Tool outputs are authored in Admin as expressions over the tool's inputs.
 * They are parsed and walked by this module rather than handed to `eval` or
 * `new Function`, so an editor — or anyone who reached the CMS — cannot turn a
 * formula into code execution. Unknown identifiers and malformed input are
 * reported as errors instead of throwing at render time.
 */

// ------------------------------------------------------------------ config

const localised = (max: number) => z.string().trim().max(max).default('');

export const toolOptionSchema = z.object({
  value: z.coerce.number().finite(),
  labelEn: localised(120),
  labelAr: localised(120),
});

export const toolInputSchema = z.object({
  key: z.string().trim().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Use letters, numbers and underscores').max(40),
  labelEn: z.string().trim().min(1).max(160),
  labelAr: localised(160),
  helpEn: localised(300),
  helpAr: localised(300),
  type: z.enum(['number', 'select']).default('number'),
  unit: localised(24),
  min: z.coerce.number().finite().nullable().default(null),
  max: z.coerce.number().finite().nullable().default(null),
  step: z.coerce.number().positive().nullable().default(null),
  defaultValue: z.coerce.number().finite().default(0),
  options: z.array(toolOptionSchema).max(24).default([]),
});

export const toolOutputSchema = z.object({
  key: z.string().trim().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/).max(40),
  labelEn: z.string().trim().min(1).max(160),
  labelAr: localised(160),
  helpEn: localised(300),
  helpAr: localised(300),
  expression: z.string().trim().min(1).max(500),
  format: z.enum(['number', 'currency', 'percent']).default('number'),
  precision: z.coerce.number().int().min(0).max(6).default(2),
  primary: z.boolean().default(false),
});

export const toolConfigSchema = z.object({
  inputs: z.array(toolInputSchema).max(24).default([]),
  outputs: z.array(toolOutputSchema).max(12).default([]),
  currency: localised(8),
  notesEn: localised(2000),
  notesAr: localised(2000),
});

export type ToolInput = z.infer<typeof toolInputSchema>;
export type ToolOutput = z.infer<typeof toolOutputSchema>;
export type ToolConfig = z.infer<typeof toolConfigSchema>;

export const EMPTY_TOOL_CONFIG: ToolConfig = { inputs: [], outputs: [], currency: '', notesEn: '', notesAr: '' };

/** Reads a stored `config` column, falling back to an empty tool when invalid. */
export function parseToolConfig(value: unknown): ToolConfig {
  const parsed = toolConfigSchema.safeParse(value ?? {});
  return parsed.success ? parsed.data : EMPTY_TOOL_CONFIG;
}

// ------------------------------------------------------------------ parser

type Token =
  | { kind: 'number'; value: number }
  | { kind: 'ident'; value: string }
  | { kind: 'op'; value: string };

const OPERATORS = ['<=', '>=', '==', '!=', '&&', '||', '+', '-', '*', '/', '%', '^', '(', ')', ',', '<', '>', '?', ':'];

export class FormulaError extends Error {}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i]!;

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      const match = /^[0-9]*\.?[0-9]+/.exec(source.slice(i));
      if (!match) throw new FormulaError(`Invalid number at position ${i}`);
      tokens.push({ kind: 'number', value: Number(match[0]) });
      i += match[0].length;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      const match = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(source.slice(i))!;
      tokens.push({ kind: 'ident', value: match[0] });
      i += match[0].length;
      continue;
    }

    const op = OPERATORS.find((o) => source.startsWith(o, i));
    if (!op) throw new FormulaError(`Unexpected character "${ch}"`);
    tokens.push({ kind: 'op', value: op });
    i += op.length;
  }

  return tokens;
}

/** Prototype-free lookups: `FUNCTIONS.constructor` must not resolve to
 *  `Object.prototype.constructor` and give a formula a handle on the runtime. */
type FormulaFunction = { arity: [number, number]; fn: (...args: number[]) => number };

const FUNCTIONS: Record<string, FormulaFunction> = Object.assign(Object.create(null) as Record<string, FormulaFunction>, {
  min: { arity: [1, 8], fn: (...a: number[]) => Math.min(...a) },
  max: { arity: [1, 8], fn: (...a: number[]) => Math.max(...a) },
  round: { arity: [1, 2], fn: (v: number, p = 0) => Math.round(v * 10 ** p) / 10 ** p },
  floor: { arity: [1, 1], fn: Math.floor },
  ceil: { arity: [1, 1], fn: Math.ceil },
  abs: { arity: [1, 1], fn: Math.abs },
  sqrt: { arity: [1, 1], fn: Math.sqrt },
  pow: { arity: [2, 2], fn: (a: number, b: number) => a ** b },
} satisfies Record<string, FormulaFunction>);

const CONSTANTS: Record<string, number> = Object.assign(Object.create(null) as Record<string, number>, {
  PI: Math.PI,
  E: Math.E,
});

/**
 * Recursive-descent evaluator. Precedence, lowest first:
 * ternary → || → && → comparison → + - → * / % → unary → ^ (right associative).
 * Booleans are represented as 1 and 0.
 */
export function evaluateFormula(expression: string, scope: Record<string, number>): number {
  const tokens = tokenize(expression);
  let pos = 0;

  const peek = () => tokens[pos];
  const eat = (value: string) => {
    const token = tokens[pos];
    if (token?.kind === 'op' && token.value === value) {
      pos++;
      return true;
    }
    return false;
  };
  const expect = (value: string) => {
    if (!eat(value)) throw new FormulaError(`Expected "${value}"`);
  };

  function ternary(): number {
    const condition = or();
    if (!eat('?')) return condition;
    const whenTrue = ternary();
    expect(':');
    const whenFalse = ternary();
    return condition !== 0 ? whenTrue : whenFalse;
  }

  function or(): number {
    let left = and();
    while (eat('||')) left = left !== 0 || and() !== 0 ? 1 : 0;
    return left;
  }

  function and(): number {
    let left = comparison();
    while (eat('&&')) left = left !== 0 && comparison() !== 0 ? 1 : 0;
    return left;
  }

  function comparison(): number {
    let left = additive();
    for (;;) {
      const token = peek();
      if (token?.kind !== 'op' || !['<', '<=', '>', '>=', '==', '!='].includes(token.value)) return left;
      pos++;
      const right = additive();
      switch (token.value) {
        case '<': left = left < right ? 1 : 0; break;
        case '<=': left = left <= right ? 1 : 0; break;
        case '>': left = left > right ? 1 : 0; break;
        case '>=': left = left >= right ? 1 : 0; break;
        case '==': left = left === right ? 1 : 0; break;
        default: left = left !== right ? 1 : 0;
      }
    }
  }

  function additive(): number {
    let left = multiplicative();
    for (;;) {
      if (eat('+')) left += multiplicative();
      else if (eat('-')) left -= multiplicative();
      else return left;
    }
  }

  function multiplicative(): number {
    let left = unary();
    for (;;) {
      if (eat('*')) left *= unary();
      else if (eat('/')) left /= unary();
      else if (eat('%')) left %= unary();
      else return left;
    }
  }

  function unary(): number {
    if (eat('-')) return -unary();
    if (eat('+')) return unary();
    return power();
  }

  function power(): number {
    const base = primary();
    // Right associative, so 2^3^2 is 2^(3^2).
    if (eat('^')) return base ** unary();
    return base;
  }

  function primary(): number {
    const token = peek();
    if (!token) throw new FormulaError('Unexpected end of formula');

    if (token.kind === 'number') {
      pos++;
      return token.value;
    }

    if (token.kind === 'ident') {
      pos++;
      const name = token.value;

      if (eat('(')) {
        const fn = Object.prototype.hasOwnProperty.call(FUNCTIONS, name) ? FUNCTIONS[name] : undefined;
        if (!fn) throw new FormulaError(`Unknown function "${name}"`);
        const args: number[] = [];
        if (!eat(')')) {
          do {
            args.push(ternary());
          } while (eat(','));
          expect(')');
        }
        const [minArgs, maxArgs] = fn.arity;
        if (args.length < minArgs || args.length > maxArgs) {
          throw new FormulaError(`"${name}" takes between ${minArgs} and ${maxArgs} arguments`);
        }
        return fn.fn(...args);
      }

      if (Object.prototype.hasOwnProperty.call(CONSTANTS, name)) return CONSTANTS[name]!;
      if (Object.prototype.hasOwnProperty.call(scope, name)) return scope[name]!;
      throw new FormulaError(`Unknown field "${name}"`);
    }

    if (eat('(')) {
      const value = ternary();
      expect(')');
      return value;
    }

    throw new FormulaError(`Unexpected "${token.value}"`);
  }

  const result = ternary();
  if (pos !== tokens.length) throw new FormulaError('Unexpected trailing characters');
  return result;
}

/** Validates a formula against the identifiers a tool actually offers. */
export function checkFormula(expression: string, availableKeys: string[]): string | null {
  const scope = Object.fromEntries(availableKeys.map((key) => [key, 1]));
  try {
    evaluateFormula(expression, scope);
    return null;
  } catch (error) {
    return error instanceof FormulaError ? error.message : 'Invalid formula';
  }
}

export type ComputedOutput = { key: string; value: number | null; error: string | null };

/**
 * Computes every output in order. Each result is added to the scope, so a
 * later output can build on an earlier one.
 */
export function computeOutputs(config: ToolConfig, values: Record<string, number>): ComputedOutput[] {
  const scope: Record<string, number> = { ...values };
  return config.outputs.map((output) => {
    try {
      const value = evaluateFormula(output.expression, scope);
      if (!Number.isFinite(value)) return { key: output.key, value: null, error: null };
      scope[output.key] = value;
      return { key: output.key, value, error: null };
    } catch (error) {
      return { key: output.key, value: null, error: error instanceof FormulaError ? error.message : 'Invalid formula' };
    }
  });
}

export function formatOutput(
  value: number | null,
  output: Pick<ToolOutput, 'format' | 'precision'>,
  locale: 'en' | 'ar',
  currency: string,
): string {
  if (value === null || !Number.isFinite(value)) return '—';

  const intlLocale = locale === 'ar' ? 'ar-SA' : 'en-GB';
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: output.precision,
    maximumFractionDigits: output.precision,
  };

  if (output.format === 'percent') {
    return `${new Intl.NumberFormat(intlLocale, options).format(value)}%`;
  }

  const formatted = new Intl.NumberFormat(intlLocale, options).format(value);
  if (output.format === 'currency' && currency) {
    return locale === 'ar' ? `${formatted} ${currency}` : `${currency} ${formatted}`;
  }
  return formatted;
}
