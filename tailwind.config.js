/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true
  },
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fill: (theme) => ({
      red: theme('colors.red.primary')
    }),
    colors: {
      white: '#ffffff',
      blue: {
        light: '#ADD8E6',
        medium: '#005c98',
        active: '#0ea5e9'
      },
      black: {
        light: '#262626',
        faded: '#00000059',
        full: '#000000'
      },
      gray: {
        base: '#616161',
        background: '#fafafa',
        primary: '#dbdbdb',
        normal: '#efefef'
      },
      red: {
        primary: '#ed4956'
      },
      green: {
        primary: '#22bc22'
      }
    },
    extend: {}
  },
  // variants: {
  //   display: ['group-hover']
  // },
  plugins: []
};
