/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"Monaco"', '"Inconsolata"', '"Fira Mono"', 'monospace']
      },
      colors: {
        primary: {
          DEFAULT: '#0066cc',
          hover: '#0052a3',
          light: '#e8f0fe',
          fg: '#ffffff'
        },
        'flight-deck': '#0066cc',
        'cabin-crew': '#30a46c',
        'ground-crew': '#d4a843',
        'shared-core': '#7c3aed',
        success: '#30a46c',
        warning: '#d4a843',
        error: '#de3f2f'
      }
    }
  },
  plugins: []
}
