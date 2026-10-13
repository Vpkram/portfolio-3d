/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#04060e',
          900: '#080b16',
          800: '#0d1326',
          700: '#151e3a',
        },
        neon: {
          blue: '#00f0ff',
          cyan: '#38bdf8',
          purple: '#a855f7',
          violet: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 25px -5px rgba(0, 240, 255, 0.45)',
        'neon-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
