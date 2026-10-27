/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Georgia', '"Times New Roman"', 'serif'],
        mono: ['"SF Mono"', '"Monaco"', '"Inconsolata"', 'monospace']
      },
      colors: {
        primary: {
          DEFAULT: '#9b5b32',
          hover: '#834826',
          light: '#fbf0e3',
          fg: '#ffffff'
        },
        'flight-deck': '#9b5b32',
        'cabin-crew': '#4f8a4a',
        'ground-crew': '#c9822f',
        'shared-core': '#8b5cf6',
        success: '#4f8a4a',
        warning: '#c9822f',
        error: '#b33a3a'
      }
    }
  },
  plugins: []
}