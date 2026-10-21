/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F6F6',
        sheet: '#FFFFFF',
        ink: '#1A1F24',
        muted: '#5B666E',
        line: '#D6DDDF',
        brand: { DEFAULT: '#7E2A2C', dark: '#5E1D1F', soft: '#F3E7E6' },
        nursing: { DEFAULT: '#0E7C7B', soft: '#E1F0EF' },
        dentistry: { DEFAULT: '#2F5DA8', soft: '#E4EBF6' },
        pharmacy: { DEFAULT: '#B26F12', soft: '#F6ECDD' },
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Onest', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { page: '76rem', read: '44rem' },
    },
  },
  plugins: [],
}
