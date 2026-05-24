/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
      },
      backgroundColor: {
        'bg-primary': '#0F172A',
        'bg-secondary': '#1E293B',
        'bg-card': '#334155',
      },
      textColor: {
        'text-primary': '#F1F5F9',
        'text-secondary': '#CBD5E1',
        'text-muted': '#94A3B8',
      },
      borderColor: {
        'rarity-common': '#9CA3AF',
        'rarity-rare': '#3B82F6',
        'rarity-epic': '#8B5CF6',
        'rarity-legendary': '#F59E0B',
      },
      animation: {
        'egg-shake': 'eggShake 0.5s ease-in-out infinite',
        'stat-bump': 'statBump 0.3s ease-in-out',
        'damage-flash': 'damageFlash 0.3s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        eggShake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        statBump: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        damageFlash: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px #8B5CF6)' },
          '50%': { filter: 'drop-shadow(0 0 20px #8B5CF6)' },
        },
      },
    },
  },
  plugins: [],
}
