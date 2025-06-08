/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Colors
      colors: {
        primary: {
          100: '#E0E7FF',
          300: '#A5B4FC',
          400: '#22d3ee', // Added cyan for compatibility (optional)
          500: '#6366F1', // Main brand color (indigo)
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        secondary: {
          400: '#FBBF24', // Yellow for theme toggle (light mode)
        },
        neutral: {
          50: '#F9FAFB', // Light background
          100: '#F3F4F6', // Page background (light)
          200: '#E5E7EB',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2A44', // Dark background
          900: '#111827', // Page background (dark)
          950: '#0B0F19', // Footer background (dark)
        },
        text: {
          primary: '#111827', // Main text (light)
          secondary: '#4B5563', // Secondary text (light)
          primaryDark: '#F9FAFB', // Main text (dark)
          secondaryDark: '#D1D5DB', // Secondary text (dark)
          footerPrimary: '#F3F4F6', // Footer text (light)
          footerSecondary: '#9CA3AF', // Footer text (dark)
        },
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },
      fontWeight: {
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      // Spacing
      spacing: {
        15: '3.75rem',
      },
      // Shadows
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Border Radius
      borderRadius: {
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      // Transitions
      transitionProperty: {
        'transform-shadow': 'transform, box-shadow',
      },
      // Z-Index
      zIndex: {
        60: '60',
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};