/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F5F1',
        brand: {
          pink: '#D91778',
          blue: '#314EF2',
          red: '#DC2626',
          black: '#0A0A0A',
        },
        accent: '#FFE566',
      },
      fontFamily: {
        head: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        body: ['Segoe UI', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        neo: '6px 4px 0px #0A0A0A',
        'neo-lg': '8px 6px 0px #0A0A0A',
        'neo-sm': '3px 3px 0px #0A0A0A',
      },
      borderRadius: { DEFAULT: '0px', none: '0px' },
    },
  },
  plugins: [],
}
