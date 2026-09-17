/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep charcoal - primary text & surfaces
        charcoal: {
          50: '#F5F5F4',
          100: '#E7E6E4',
          200: '#CFCCC8',
          300: '#A8A39C',
          400: '#78726A',
          500: '#524C45',
          600: '#3A352F',
          700: '#2A2622',
          800: '#1D1A17',
          900: '#141210',
          950: '#0B0A09',
        },
        // Warm off-white - background
        cream: {
          50: '#FEFDFB',
          100: '#FBF8F2',
          200: '#F6F1E7',
          300: '#EFE7D6',
          400: '#E3D6BC',
        },
        // Soft natural green - secondary
        sage: {
          50: '#F2F6F1',
          100: '#E1EAE0',
          200: '#C2D5BF',
          300: '#9CBB98',
          400: '#729D6D',
          500: '#527A4E',
          600: '#41623E',
          700: '#344E32',
          800: '#293E28',
          900: '#213220',
        },
        // Warm orange/coral - accent (CTA, highlights)
        coral: {
          50: '#FDF3EE',
          100: '#FBE3D6',
          200: '#F5C1A6',
          300: '#EE9C72',
          400: '#E67B49',
          500: '#D9612D',
          600: '#B84C22',
          700: '#943C1C',
          800: '#733019',
          900: '#5C2716',
        },
        // Controlled emergency red
        rescue: {
          50: '#FCF0EF',
          100: '#F8DAD7',
          200: '#EFAFA8',
          300: '#E4837A',
          400: '#D75D52',
          500: '#C33F33',
          600: '#A22F26',
          700: '#7F2620',
          800: '#631F1B',
          900: '#4E1A17',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.75rem, 6vw, 6.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 4.2vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.375rem, 2vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        soft: '0 2px 24px -4px rgba(20, 18, 16, 0.08)',
        card: '0 8px 30px -8px rgba(20, 18, 16, 0.12)',
        glow: '0 0 0 1px rgba(217, 97, 45, 0.15), 0 8px 24px -8px rgba(217, 97, 45, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drawLine: {
          to: { strokeDashoffset: 0 },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
