/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep charcoal - primary text & surfaces (deepened for more contrast/richness)
        charcoal: {
          50: '#F5F5F4',
          100: '#E7E6E4',
          200: '#CFCCC8',
          300: '#A8A39C',
          400: '#78726A',
          500: '#524C45',
          600: '#38332D',
          700: '#252119',
          800: '#1A1714',
          900: '#100E0C',
          950: '#070606',
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
        // Burnt gold / amber - accent (CTA, highlights). Token name kept as
        // "coral" so every existing class (bg-coral-500, text-coral-600, ...)
        // keeps working - only the hue underneath changed, to a richer,
        // more premium amber/bronze instead of the previous orange-coral.
        coral: {
          50: '#FBF3E7',
          100: '#F5E2C6',
          200: '#EACB93',
          300: '#DCAD5D',
          400: '#CB9038',
          500: '#B87422',
          600: '#955C1B',
          700: '#744818',
          800: '#573717',
          900: '#402914',
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
        soft: '0 2px 28px -4px rgba(16, 14, 12, 0.12)',
        card: '0 10px 36px -10px rgba(16, 14, 12, 0.16)',
        glow: '0 0 0 1px rgba(184, 116, 34, 0.18), 0 10px 28px -8px rgba(184, 116, 34, 0.4)',
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
