/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background - Dark Theme
        'bg-primary': '#0A0F1C',
        'bg-secondary': '#111827',
        'bg-tertiary': '#1A2238',
        'bg-card': '#141B2D',
        
        // Text
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        
        // Neon Accents
        'accent-primary': '#00F5FF',
        'accent-secondary': '#7C3AED',
        'accent-success': '#00FFA3',
        'accent-danger': '#FF3B6B',
        'accent-warning': '#FFC857',
        
        // Borders
        'border-primary': '#1F2937',
        'border-accent': '#00F5FF',
        
        // Trading Colors
        'trade-buy': '#00FFA3',
        'trade-sell': '#FF3B6B',
        'trade-neutral': '#9CA3AF',
        'trade-liquidity': '#00F5FF',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 245, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(124, 58, 237, 0.3)',
        'neon-green': '0 0 10px rgba(0, 255, 163, 0.3)',
        'neon-red': '0 0 10px rgba(255, 59, 107, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00F5FF, #7C3AED)',
        'gradient-success': 'linear-gradient(135deg, #00FFA3, #00F5FF)',
        'gradient-danger': 'linear-gradient(135deg, #FF3B6B, #FF8A00)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 245, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

