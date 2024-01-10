/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // tailwind.config.js
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}
