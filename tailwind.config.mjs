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
  theme:{
    colors:{
      'primaryOrange':'#F0642E',
      'secondaryOrange':'#F29120',
      'white':'#FFFFFF',
      'lightGrey':'#D0D0D0',
      'grey':'#93979E',
      'darkGrey':'#333333',
      'black':'#060606',
      'gradientOrange': 'linear-gradient(to right, #F0642E, #EE201C, #F29120)',
    },
     extend: {
    backgroundImage: {
      'gradientGreyWhite':'linear-gradient(to right, #989898, #FEFEFE)',
       'gradientOrange': 'linear-gradient(to right, #F0642E, #EE201C, #F29120)',
       'gradientOrangeButton':'linear-gradient(90deg, #FF541F 0.01%, #F29120 50.01%, #FFDC5F 100%), linear-gradient(0deg, rgba(255,255,255,0.4), rgba(255,255,255,0.4))'
      //  'gradientOrangeButton': 'linear-gradient(to right, #FF541F, #F29120, #FFDC5F)',
    },
    
  },
  },
  
}

export default config
