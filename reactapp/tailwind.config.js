/* eslint-disable import/no-extraneous-dependencies */
const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');

module.exports = {
  important: true,
  theme: {
    colors: {
      gray: colors.slate,
      green: colors.emerald,
      orange: colors.orange,
      red: colors.red,
      yellow: colors.amber,
      black: '#000000',
      white: '#ffffff',
      customGray: '#c2c2c2',
      customOrange: '#f37321',
      customCement: '#646464',
      grey: '#ebebeb',
      lightGrey: '#dbdbdb',
      textGrey: '#a2a9ad',
      backgroundGrey: '#f7f9fb',
      textBlue: '#006bb4',
      customBlack: '#414042',
      errorRed: '#e02b27',
      textBlack: '#3f495c',
      darkerGrey: '#333',
      errorRed: '#f32121',
      mildGrey: '#bbb',
      mildCement: '#f4f4f4',
      greyCement: '#999',
    },
    extend: {
      colors: {
        primary: {
          lighter: colors.blue['300'],
          DEFAULT: colors.blue['800'],
          darker: colors.blue['900'],
        },
        secondary: {
          lighter: colors.blue['100'],
          DEFAULT: colors.blue['200'],
          darker: colors.blue['300'],
        },
        background: {
          lighter: colors.blue['100'],
          DEFAULT: colors.blue['200'],
          darker: colors.blue['300'],
        },
      },
      textColor: {
        primary: {
          lighter: colors.slate['700'],
          DEFAULT: colors.slate['800'],
          darker: colors.slate['900'],
        },
        secondary: {
          lighter: colors.slate['400'],
          DEFAULT: colors.slate['600'],
          darker: colors.slate['800'],
        },
      },
      backgroundColor: {
        primary: {
          lighter: colors.blue['600'],
          DEFAULT: colors.blue['700'],
          darker: colors.blue['800'],
        },
        secondary: {
          lighter: colors.blue['100'],
          DEFAULT: colors.blue['200'],
          darker: colors.blue['300'],
        },
        container: {
          lighter: '#ffffff',
          DEFAULT: '#fafafa',
          darker: '#f5f5f5',
        },
      },
      fontSize: {
        '25px': '25px',
      },
      height: {
        '30px': '30px',
        '60px': '60px',
        '50px': '50px',
      },
      width: {
        '30px': '30px',
        '177px': '177px',
      },
      spacing: {
        7.5: '30px',
        2.5: '10px',
      },
      letterSpacing: {
        '1px': '1px',
      },
      fontFamily: {
        sans: ['Gotham', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      transitionProperty: {
        all: 'all',
      },
      transitionTimingFunction: {
        ease: 'ease',
      },
      transitionDuration: {
        400: '400ms',
      },
      fontFamily: {
        gotham: [
          'Gotham',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
          'Arial',
        ],
      },
      fontWeight: {
        extralight: 100,
        light: 400,
        medium: 500,
        book: 600,
        bold: 700,
        mediumsharp: 800,
      },
      borderColor: {
        primary: {
          lighter: colors.blue['600'],
          DEFAULT: colors.blue['700'],
          darker: colors.blue['800'],
        },
        secondary: {
          lighter: colors.blue['100'],
          DEFAULT: colors.blue['200'],
          darker: colors.blue['300'],
        },
        container: {
          lighter: '#f5f5f5',
          DEFAULT: '#e7e7e7',
          darker: '#b6b6b6',
        },
      },
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }
        md: '768px',
        // => @media (min-width: 768px) { ... }
        lg: '1024px',
        // => @media (min-width: 1024px) { ... }
        xl: '1280px',
        // => @media (min-width: 1280px) { ... }
        'max-lg': { max: '1024px' },
        // =>@media (max-width: 1024px) { ... }
      },
    },
  },
  plugins: [forms],
  content: ['./src/**/*.jsx', '../view/frontend/templates/**/*.phtml'],
};
