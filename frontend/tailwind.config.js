/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Specify paths to your source files        
  ],
  theme: {
    extend: {
      colors: {
        primary: "#667eea", 
        secondary: "#764ba2",
      },
      fontFamily: {
        nunito: ["'Nunito'", "sans-serif"], 
      },
      animation: {
        fadeInDown: "fadeInDown 1s ease-out", 
      },
      keyframes: {
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [], 
};


