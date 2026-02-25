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
          bg: '#0B0B0E',
          surface: '#1C1C24',
          card: '#14141A',
          border: 'rgba(201,169,110,.12)',
          gold: '#C9A96E',
          'gold-light': '#E8D5A8',
          'gold-dark': '#A88A52',
          text: '#E8E4DD',
          muted: '#7A7670',
          white: '#ffffff',
          navy: '#0D1B2A',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
