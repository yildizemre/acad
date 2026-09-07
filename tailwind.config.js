/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.75rem', lg: '2.5rem' },
      screens: { '2xl': '1180px' },
    },
    extend: {
      colors: {
        // ── Mürekkep mavisi — ana marka rengi, başlıklar ve koyu yüzeyler
        ink: {
          50: '#F2F5F9',
          100: '#E3E9F1',
          200: '#C4D0E1',
          300: '#9BAECA',
          400: '#6C86AC',
          500: '#4A6791',
          600: '#375277',
          700: '#2A4061',
          800: '#1E3050',
          900: '#152540',
          950: '#0E2038',
        },
        // ── Kum / kağıt — zemin. Beyaz kullanmıyoruz.
        sand: {
          50: '#FBF9F5',
          100: '#F5F1EA',
          200: '#EDE7DC',
          300: '#DFD6C6',
          400: '#C9BFAE',
          500: '#ADA091',
          600: '#8B7F70',
          700: '#6B6155',
          800: '#4A423A',
          900: '#2E2924',
        },
        // ── Tuğla — tek aksan. Sadece eylem çağrısı ve vurgu.
        brick: {
          50: '#FBF2EF',
          100: '#F6E1DA',
          200: '#EDC5B6',
          300: '#E09E86',
          400: '#CF7052',
          500: '#B8432B',
          600: '#9E3723',
          700: '#822C1D',
          800: '#68251A',
          900: '#562118',
        },
        // ── Elektrik mavisi — LOGO RENGİ (#1B18FF).
        // Kısıtlı kullanım: bağlantılar, odak halkası, seçili durumlar ve
        // marka işareti. Dolgu olarak geniş alanlarda kullanılmaz — çok baskın.
        electric: {
          50: '#EFEFFF',
          100: '#E0DFFF',
          200: '#C4C2FF',
          300: '#9B98FF',
          400: '#6663FF',
          500: '#1B18FF',
          600: '#1512D6',
          700: '#110FA8',
          800: '#0E0C85',
          900: '#0B0A66',
        },
        // ── Kurşun — gövde metni. Mürekkepten daha doygunsuz.
        lead: {
          300: '#B4BCC8',
          400: '#8A94A6',
          500: '#6B7688',
          600: '#525E72',
          700: '#3E4A5E',
          800: '#2A3444',
          900: '#1C2433',
        },
      },
      fontFamily: {
        // Gövde ve arayüz
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Başlıklar — serif. Siteyi "yayınevi" tarafına çeken asıl karar.
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-sm': [
          'clamp(1.65rem, 1.35rem + 1.4vw, 2.35rem)',
          { lineHeight: '1.16', letterSpacing: '-0.015em' },
        ],
        'display-md': [
          'clamp(2.1rem, 1.6rem + 2.3vw, 3.25rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        'display-lg': [
          'clamp(2.5rem, 1.75rem + 3.4vw, 4.1rem)',
          { lineHeight: '1.06', letterSpacing: '-0.025em' },
        ],
      },
      borderRadius: {
        // Dengeli form dili: 8px temel yarıçap
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '10px',
        '3xl': '12px',
      },
      boxShadow: {
        // Gölge neredeyse yok; derinlik çizgiyle kuruluyor
        soft: '0 1px 2px rgba(14,32,56,0.05)',
        lift: '0 2px 8px rgba(14,32,56,0.07), 0 12px 28px -16px rgba(14,32,56,0.18)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.25s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
