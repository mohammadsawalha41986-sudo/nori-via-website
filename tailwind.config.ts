import type { Config } from 'tailwindcss';

/**
 * Colours resolve through CSS custom properties declared in `globals.css`, so
 * the Design System screen in Admin can re-declare a token and have every
 * existing utility — opacity modifiers included — follow it. The channel form
 * (`245 16 110`) is what makes `bg-brand/20` keep working.
 */
const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

/** A type step that follows the locale multiplier declared in `globals.css`. */
const size = (rem: number, leading: number): [string, { lineHeight: string }] => [
  `calc(${rem}rem * var(--font-scale, 1))`,
  { lineHeight: String(leading) },
];

const ramp = (family: string, stops: (number | 'DEFAULT')[]) =>
  Object.fromEntries(
    stops.map((stop) => [stop, channel(`--c-${family}${stop === 'DEFAULT' ? '' : `-${stop}`}`)]),
  );

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: ramp('ink', ['DEFAULT', 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        brand: ramp('brand', ['DEFAULT', 50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        bone: channel('--c-bone'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-sans)', 'sans-serif'],
      },
      /* Line height is a property of the size; letter spacing is a design
         token, so it is deliberately not set here — `.font-display` applies
         `--tracking-heading` instead.

         Every step is multiplied by `--font-scale`, declared in `globals.css`
         as 1 and stepped up for RTL: Arabic has no capitals and a smaller
         apparent x-height, so the same nominal size reads noticeably smaller
         than its Latin counterpart. Keeping the multiplier inside the scale —
         rather than zooming the root font size — moves type without dragging
         the rem-based spacing and container widths along with it.

         The lower steps also start higher than Tailwind's defaults: nothing in
         the public UI should render below ~13px. */
      fontSize: {
        xs: size(0.8125, 1.6),
        sm: size(0.9375, 1.6),
        base: size(1.0625, 1.7),
        lg: size(1.1875, 1.55),
        xl: size(1.375, 1.45),
        '2xl': size(1.625, 1.35),
        '3xl': size(2, 1.25),
        '4xl': size(2.5, 1.18),
        '5xl': size(3.25, 1.1),
        'display-sm': ['calc(clamp(2.2rem,6vw,3.4rem) * var(--font-scale, 1))', { lineHeight: '0.95' }],
        'display-md': ['calc(clamp(2.8rem,8vw,5rem) * var(--font-scale, 1))', { lineHeight: '0.92' }],
        'display-lg': ['calc(clamp(3.2rem,10vw,8rem) * var(--font-scale, 1))', { lineHeight: '0.88' }],
      },
      borderRadius: {
        btn: 'var(--radius-btn)',
        card: 'var(--radius-card)',
        input: 'var(--radius-input)',
      },
      maxWidth: { shell: 'var(--shell-max)' },
      transitionTimingFunction: { noriva: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
export default config;
