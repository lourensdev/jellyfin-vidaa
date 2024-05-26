import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        gray: 'var(--gray)',
      },
      padding: {
        overscan: '96px',
      },
      aspectRatio: {
        poster: '2 / 3',
      },
    },
  },
  plugins: [],
};
export default config;
