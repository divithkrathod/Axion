/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#e2e8f0',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3a66',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          pink: '#ec4899',
        },
      },
      backgroundColor: {
        'dark-primary': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-tertiary': '#334155',
      },
      textColor: {
        'dark-primary': '#e2e8f0',
        'dark-secondary': '#cbd5e1',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(6, 182, 212, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(6, 182, 212, 0)',
          },
        },
        'glow': {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(6, 182, 212, 0.8)',
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
