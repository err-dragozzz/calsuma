import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: '#efe9dd',
        cream: '#e6ded0',
        graphite: '#1c1d20',
        charcoal: '#2b2c30',
        accent: {
          orange: '#e8622a',
          red: '#d23b34',
        },
        lcd: {
          bg: '#c3ceb6',
          ink: '#20261c',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        digit: ['var(--font-digit)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        key: '0 1px 0 rgba(255,255,255,0.4) inset, 0 -2px 3px rgba(0,0,0,0.18) inset',
      },
      transitionTimingFunction: {
        mech: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'boot-flicker': {
          '0%': { opacity: '0' },
          '20%': { opacity: '0.4' },
          '35%': { opacity: '0.1' },
          '60%': { opacity: '0.9' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'boot-flicker': 'boot-flicker 900ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
