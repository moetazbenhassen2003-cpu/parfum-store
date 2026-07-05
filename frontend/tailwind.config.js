/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bg':        '#FAF9F6',
        'surface':   '#FFFFFF',
        'surface-2': '#F4F1EB',
        'gold':      '#D4AF37',
        'gold-hover':'#C19B2E',
        'text':      '#2C2C2C',
        'muted':     '#6B6B6B',
        'danger':    '#E53E3E',
        'success':   '#38A169',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'sans':    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
}
