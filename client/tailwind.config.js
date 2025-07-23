module.exports = {
  darkMode: 'media',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',       // app folder (pages, layouts, etc)
    './src/components/**/*.{js,ts,jsx,tsx}', // components
    // No need to include 'lib' unless you have UI code there
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
};
