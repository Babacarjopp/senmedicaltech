/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette principale — Bleu médical sombre + or accent
        primary: {
          50:  "#e8f0fe",
          100: "#c7ddfb",
          200: "#90bbf7",
          300: "#5a9af2",
          400: "#2b7aed",
          500: "#1a5cba",   // principal
          600: "#154a95",
          700: "#103a72",
          800: "#0b2a52",
          900: "#061a33",
        },
        accent: {
          400: "#f5c842",
          500: "#e6b800",   // or
          600: "#c9a200",
        },
        neutral: {
          50:  "#f8f9fa",
          100: "#f1f3f5",
          200: "#dee2e6",
          300: "#adb5bd",
          400: "#868e96",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#23272b",
          900: "#1a1d20",
        },
      },
      fontFamily: {
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
        mono: ["'Courier New'", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 6px 24px rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};
