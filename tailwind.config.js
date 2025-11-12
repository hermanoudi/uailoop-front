/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta UAILOOP (inspirada no Spotify)
        primary: {
          DEFAULT: '#1DB954', // Verde principal
          dark: '#1AA34A',    // Verde escuro
          light: '#1ED760',   // Verde claro
        },
        'green-uai': {
          DEFAULT: '#1DB954', // Verde principal (alias para primary)
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#1DB954',
          600: '#1AA34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        dark: {
          DEFAULT: '#191414', // Preto
          gray: '#282828',    // Cinza escuro
        },
        light: {
          DEFAULT: '#FFFFFF', // Branco
          gray: '#B3B3B3',    // Cinza claro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
        '3xl': '48px',
      }
    },
  },
  plugins: [],
}
