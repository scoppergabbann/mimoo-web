import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === Mimoo Brand Palette ===
        mimoo: {
          // Primary purple — soft lavender, bukan ungu loud
          purple: {
            50: '#F5F2FF',
            100: '#EBE5FF',
            200: '#D6C9FF',
            300: '#B8A4F5',
            400: '#9B8FE8',
            500: '#8B7FD9', // primary
            600: '#7363C7',
            700: '#5D4FA8',
            800: '#4A3F87',
            900: '#3A3169',
          },
          // Cream — warm background
          cream: {
            50: '#FFFDF8',
            100: '#FFF9F0',
            200: '#FDF8F1',
            300: '#FAF1DE',
            400: '#F5E8CE',
          },
          // Sky blue accent
          sky: {
            50: '#F0F7FF',
            100: '#DCEBFF',
            200: '#B8D7FF',
            300: '#8EBEFF',
            400: '#6BA5FA',
            500: '#5294F0',
          },
          // Pink — emotional/privacy touches
          pink: {
            50: '#FFF0F5',
            100: '#FFD9E5',
            200: '#FFB8CD',
            300: '#FF94B0',
            400: '#FA7095',
          },
          // Mint — secondary accent
          mint: {
            50: '#F0FDF7',
            100: '#D1FADF',
            200: '#A6F0C2',
            300: '#76E0A0',
          },
          // Text colors
          ink: {
            50: '#F8F8FB',
            100: '#E8E8F0',
            300: '#9999B0',
            500: '#5A5A75',
            700: '#2D2D45',
            900: '#1A1A2E',
          },
        },
      },
      fontFamily: {
        // Display: chunky, rounded, friendly
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // Body: clean, readable
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom scale for hierarchy
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'cozy': '1.25rem', // 20px — Mimoo signature
        'cozy-lg': '1.75rem', // 28px
        'cozy-xl': '2rem', // 32px
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(139, 127, 217, 0.08), 0 2px 8px -2px rgba(139, 127, 217, 0.04)',
        'soft-lg': '0 12px 40px -8px rgba(139, 127, 217, 0.15), 0 4px 16px -4px rgba(139, 127, 217, 0.08)',
        'soft-xl': '0 24px 60px -12px rgba(139, 127, 217, 0.2), 0 8px 24px -8px rgba(139, 127, 217, 0.12)',
        'float': '0 16px 32px -8px rgba(139, 127, 217, 0.18)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(139, 127, 217, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pop': 'pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'wave': 'wave 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wave: {
          '0%, 60%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '40%, 50%': { transform: 'rotate(10deg)' },
        },
      },
      backgroundImage: {
        'gradient-cozy': 'linear-gradient(135deg, #FFF9F0 0%, #F5F2FF 100%)',
        'gradient-purple': 'linear-gradient(135deg, #B8A4F5 0%, #8B7FD9 100%)',
        'gradient-soft': 'linear-gradient(180deg, transparent 0%, #F5F2FF 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
