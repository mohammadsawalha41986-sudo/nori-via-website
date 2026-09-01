import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1225',
          50: '#F5F6F9',
          100: '#E6E9F0',
          200: '#C6CCDA',
          300: '#98A2BC',
          400: '#5F6B8C',
          500: '#374465',
          600: '#222E4D',
          700: '#16213C',
          800: '#111C3A',
          900: '#0B1225',
          950: '#060A16',
        },
        brand: {
          DEFAULT: '#F5106E',
          50: '#FFF1F6',
          100: '#FFE0EC',
          200: '#FFC0DA',
          300: '#FF8DBB',
          400: '#FC4B92',
          500: '#F5106E',
          600: '#D6005A',
          700: '#B0004A',
          800: '#8A003A',
          900: '#66002B',
        },
        bone: '#F7F5F2',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['clamp(2.2rem,6vw,3.4rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2.8rem,8vw,5rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(3.2rem,10vw,8rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
      },
      maxWidth: { shell: '88rem' },
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
