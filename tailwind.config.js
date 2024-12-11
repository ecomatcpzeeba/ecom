const { Config } = require('tailwindcss')

/** @type {Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      primary: '#8e3816',
      second: '#f3c3b0',
      complementary: '#0037ff',
      accent: '#000000',
    },
    screens: {
      s: { min: '220px', max: '315px' },
      xs: { min: '316px', max: '413px' },
      xxs: { min: '414px', max: '639px' },
      sm: { min: '640px', max: '767px' },
      md: { min: '768px', max: '1023px' },
      lg: { min: '1024px', max: '1279px' },
      xl: { min: '1280px', max: '1535px' },
      xxl: { min: '1536px', max: '2563px' },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#fbbf24',
          '.toaster-con': {
            'background-color': 'white',
            color: 'black',
          },
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#fbbf24',
          '.toaster-con': {
            'background-color': 'black',
            color: 'white',
          },
        },
      },
    ],
  },
  darkMode: 'class',
  plugins: [require('daisyui')],
}
