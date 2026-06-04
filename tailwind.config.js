/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5fa',
          100: '#d8e4f0',
          200: '#b3cde0',
          300: '#81aecd',
          400: '#4e8db8',
          500: '#2d6fa0',
          600: '#1e5a87',
          700: '#1a4a6e',
          800: '#1a3f5b',
          900: '#1e3a5f',
        },
        risk: {
          high: '#e74c3c',
          medium: '#f39c12',
          low: '#27ae60',
        }
      },
      fontFamily: {
        sans: ['"Source Han Sans CN"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
