/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        keep: {
          white: "#ffffff",
          red: "#f28b82",
          orange: "#fbbc04",
          yellow: "#fff475",
          green: "#ccff90",
          teal: "#a7ffeb",
          blue: "#cbf0f8",
          darkblue: "#aecbfa",
          purple: "#d7aefb",
          pink: "#fdcfe8",
          brown: "#e6c9a8",
          gray: "#e8eaed",
        }
      },
      boxShadow: {
        'keep': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'keep-hover': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
      },
      transitionDuration: {
        '200': '200ms',
      }
    },
  },
  plugins: [],
}
