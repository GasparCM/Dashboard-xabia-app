/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00788A',
          dark: '#005E6B',
          contrast: '#FFFFFF',
        },
        text: {
          'title-strong': '#2A2A2A',
          title: '#4B5563',
          body: '#696969',
        },
        bg: {
          app: '#F6F6F6',
          card: '#FFFFFF',
        },
        border: '#E5E7EB',
        success: '#16A34A',
        warning: '#F4AC47',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      borderRadius: {
        'card': '12px',
        'button': '12px',
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      }
    },
  },
  plugins: [],
};