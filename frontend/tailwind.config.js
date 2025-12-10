module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00FF94',
          red: '#FF0055',
          cyan: '#00F0FF',
          purple: '#BD00FF',
          yellow: '#F5D300',
        },
        arcade: {
          bg: '#050505',
          paper: '#0A0A0A',
          overlay: 'rgba(5, 5, 5, 0.85)',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
        ui: ['"Rajdhani"', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};