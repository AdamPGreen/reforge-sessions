/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#edf1ff',
          100: '#dce4ff',
          200: '#b9c9ff',
          300: '#96adff',
          400: '#7392ff',
          500: '#5076ff',
          600: '#4e61e6', // #87A1FFCF modified for better contrast
          700: '#3f50c0',
          800: '#31409a',
          900: '#232f74',
        },
        accent: {
          50: '#f0fffe',
          100: '#e0fffd',
          200: '#c1fbfa',
          300: '#a2f7f6',
          400: '#83eef1',
          500: '#64e5ec',
          600: '#46bcc4', // #B4F3F1 modified for better contrast
          700: '#379399',
          800: '#27696e',
          900: '#173f43',
        },
        dark: {
          DEFAULT: '#080A0A',
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#808080',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          800: '#1a1a1a',
          900: '#080A0A',
        },
        light: {
          DEFAULT: '#EFEDE6',
          50: '#ffffff',
          100: '#EFEDE6',
          200: '#e6e4de',
          300: '#d8d6d0',
          400: '#c9c7c1',
          500: '#bab8b2',
          600: '#a6a49e',
          700: '#92908a',
          800: '#7e7c76',
          900: '#6a6862',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(295deg, #B4F3F1 15.4%, #FFE8FF 88.03%)',
      },
    },
  },
  plugins: [],
}