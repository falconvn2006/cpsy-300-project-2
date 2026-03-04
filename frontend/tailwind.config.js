/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#f5faff',
          100: '#e6f0ff',
          300: '#66a6ff',
          500: '#2563eb',
          700: '#1e40af',
        },
        accent: {
          500: '#7c3aed',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
      },
    },
  },
  plugins: [],
};
