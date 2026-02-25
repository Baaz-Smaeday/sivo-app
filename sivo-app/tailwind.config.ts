import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#141414',
          surface: '#1a1a1a',
          card: '#1e1e1e',
          border: '#2a2a2a',
          gold: '#c9a96e',
          'gold-light': '#d4b87a',
          'gold-dark': '#b8944f',
          text: '#e5e5e5',
          muted: '#888888',
          white: '#ffffff',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
