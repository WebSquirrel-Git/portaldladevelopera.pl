import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: '#FFFFFF',
        primaryOrange: '#F0642E',
        secondaryOrange: '#F29120',
        white: '#FFFFFF',
        lightGrey: '#D0D0D0',
        grey: '#93979E',
        darkGrey: '#333333',
        black: '#060606',
        dark: '#1B1B1C',
        yellowStroke: '#FEE298',
      },
      colors: {
        primaryOrange: '#F0642E',
        secondaryOrange: '#F29120',
        white: '#FFFFFF',
        lightGrey: '#D0D0D0',
        grey: '#93979E',
        darkGrey: '#333333',
        black: '#060606',
        yellowStroke: '#FEE298',
        gradientOrange: 'linear-gradient(90deg, #FE9A79 0.01%, #F8C07D 50.01%, #FEE298 100%)',
      },
      backgroundImage: {
        gradientGreyWhite: 'linear-gradient(to right, #989898, #FEFEFE)',
        gradientOrange: 'linear-gradient(90deg, #FE9A79 0.01%, #F8C07D 50.01%, #FEE298 100%)',
        gradientOrangeButton: 'linear-gradient(90deg, #FE9A79 0.01%, #F8C07D 50.01%, #FEE298 100%)',
        gradientBrown:
          'linear-gradient(325.41deg, #1B1B1C 49.82%, rgba(250, 172, 121, 0.1) 128.97%)',
      },
    },
  },
}

export default config
