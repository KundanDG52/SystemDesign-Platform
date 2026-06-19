/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080c14',
        surface: '#0c121e',
        panel: '#0f1626',
        border: '#1c2740',
        cyan: '#22d3ee',
        emerald: '#10b981',
        violet: '#8b5cf6',
        amber: '#f59e0b',
        rose: '#f43f5e',
        ink: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'flow-dash': { to: { strokeDashoffset: '-20' } },
        'ping-soft': { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
        pulse: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'flow-dash': 'flow-dash 0.5s linear infinite',
        'ping-soft': 'ping-soft 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
}
