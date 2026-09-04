import type { Config } from 'tailwindcss';

/**
 * Colours resolve through CSS custom properties declared in `globals.css`, so
 * the Design System screen in Admin can re-declare a token and have every
 * existing utility — opacity modifiers included — follow it. The channel form
 * (`245 16 110`) is what makes `bg-brand/20` keep working.
 */
const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

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
         `--tracking-heading` instead. */
      fontSize: {
        'display-sm': ['clamp(2.2rem,6vw,3.4rem)', { lineHeight: '0.95' }],
        'display-md': ['clamp(2.8rem,8vw,5rem)', { lineHeight: '0.92' }],
        'display-lg': ['clamp(3.2rem,10vw,8rem)', { lineHeight: '0.88' }],
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
