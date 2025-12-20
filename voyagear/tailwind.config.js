/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B3C5D",
        secondary: "#FF7A18",
        accent: "#328CC1",
        background: "#F7F9FC",
        textPrimary: "#1E1E1E",
        textMuted: "#6B7280",
      },
    },
  },
  plugins: [],
};
