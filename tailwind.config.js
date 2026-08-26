/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#011E52', muted: '#94a3b8', faint: '#475569' }, // deep navy
        warm: { 50: '#020914', 100: '#011E52', 200: '#132857' }, // dark navy themes
        fire: { DEFAULT: '#FD7B00', 50: '#fff7ed', 100: '#ffedd5', 600: '#EA580C' }, // vibrant orange
        electric: { DEFAULT: '#FF8C00' }, // secondary orange
        ocean: { DEFAULT: '#1E3A8A', 600: '#172554' }, // secondary deep blue
      },
      fontFamily: { 
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Montserrat"', 'ui-sans-serif', 'system-ui', 'sans-serif'] 
      },
      fontSize: {
        hero: ['clamp(3.5rem,8vw,7rem)', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '900' }],
        'hero-sub': ['clamp(1.125rem,1.5vw,1.35rem)', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '500' }],
        section: ['clamp(2.5rem,5vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '800' }],
        lead: ['1.125rem', { lineHeight: '1.75', letterSpacing: '-0.01em' }],
      },
      backgroundImage: { 
        'dots-light': 'radial-gradient(circle,rgba(11,27,66,0.05) 1px,transparent 1px)',
        'premium-gradient': 'radial-gradient(circle at top, #ffffff 0%, #f1f5f9 100%)'
      },
      backgroundSize: { dots: '24px 24px' },
      spacing: { 18: '4.5rem', 22: '5.5rem', 30: '7.5rem' },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseGlow: { '0%, 100%': { opacity: 0.3, transform: 'scale(1)' }, '50%': { opacity: 0.7, transform: 'scale(1.1)' } }
      },
    },
  },
  plugins: [],
}
