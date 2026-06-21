export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Biotech palette
        'bg-dark': '#0A0A0B',
        'card-dark': '#14141A',
        'teal-deep': '#0F4C45',
        'teal-light': '#134E4A',
        'gold-muted': '#C9A35C',
        'text-off-white': '#F5F5F0',
        'text-warm-gray': '#9CA3AF',
        // Keep existing for compatibility
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#2a9d8f',
        danger: '#e63946',
        warning: '#f4a261',
      },
      fontFamily: {
        serif: ['Fraunces', 'Newsreader', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        slideUp: 'slideUp 0.6s ease-out',
        fadeIn: 'fadeIn 0.6s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'helix-drift': 'helix-drift 20s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'helix-drift': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '100%': { transform: 'translateY(-20px) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
