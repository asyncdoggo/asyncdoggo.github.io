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
          50: '#f8f3ff',
          100: '#f0e5ff',
          200: '#e6d5ff',
          300: '#d4b5ff',
          400: '#c48eff',
          500: '#b366ff',
          600: '#a844ff',
          700: '#9620f0',
          800: '#7d1dd4',
          900: '#6b1bb8',
        },
        accent: {
          50: '#fff5e6',
          100: '#ffe8cc',
          200: '#ffd699',
          300: '#ffc266',
          400: '#ffb333',
          500: '#ff9f00',
          600: '#e68a00',
          700: '#cc7700',
          800: '#b36200',
          900: '#994d00',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 32px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.8)',
        'glass-dark': 'rgba(30, 30, 30, 0.8)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(20, 20, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.btn-transition': {
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.window-transition': {
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      })
    }),
  ],
}

