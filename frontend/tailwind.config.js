/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFEFA",     // slightly warm off-white
        ink: "#0B1220",
        brand: {
          50: "#ECFFFB",
          100: "#C8FFF3",
          200: "#8DFFE4",
          300: "#4FFFD4",
          400: "#18FBC4",
          500: "#00E6B3",
          600: "#00B58D",
          700: "#007D63",
          800: "#005848",
          900: "#00382F",
        },
        electric: {
          500: "#2B7CFF",
          600: "#1F5BFF",
        },
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(0,230,179,0.35), 0 10px 30px rgba(0,0,0,0.08)",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: 0, transform: "translateX(14px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        slideUp: "slideUp 420ms ease-out",
        slideInRight: "slideInRight 420ms ease-out",
      },
    },
  },
  plugins: [],
};
