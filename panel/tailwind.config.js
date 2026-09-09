/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.75rem', lg: '2.5rem' },
      screens: { '2xl': '1240px' },
    },
    extend: {
      colors: {
        // ── Metin ve koyu yüzeyler. Lacivert değil, siyaha yakın — vurucu.
        night: {
          50: '#F6F7F8',
          100: '#EDEEF1',
          200: '#D9DCE1',
          300: '#B4BAC4',
          400: '#8A929F',
          500: '#646D7C',
          600: '#474F5D',
          700: '#333A46',
          800: '#22272F',
          900: '#181C22',
          950: '#0F1216',
        },
        // ── Marka mavisi (logo rengi). Ana eylem rengi.
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
        // ── Fosforlu vurgu. Başlıklarda kelime altını boyamak için.
        marker: {
          DEFAULT: '#D8F84E',
          soft: '#EAFBA6',
        },
        // ── Kart zeminleri. Her kursun kendi rengi olur.
        tint: {
          peach: '#FFEADF',
          rose: '#FCE4F2',
          lime: '#EDF9CE',
          sky: '#E2ECFE',
          lilac: '#EDE7FE',
          mint: '#DCF5EC',
          sand: '#FBF3E4',
        },
        // ── Sıcak aksan (ikinci derece)
        brick: {
          50: '#FBF2EF',
          100: '#F6E1DA',
          200: '#EDC5B6',
          300: '#E09E86',
          400: '#CF7052',
          500: '#B8432B',
          600: '#9E3723',
          700: '#822C1D',
        },
      },
      fontFamily: {
        // Gövde ve başlıklar aynı aileden — Kodland gibi tek, kalın, geometrik
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // ⚠️ SATIR YÜKSEKLİKLERİ TÜRKÇE İÇİN AYARLI — düşürmeyin.
        //
        // İngilizce başlıklarda 1.0–1.05 satır yüksekliği sorunsuz durur, ama
        // Türkçede aynı satırda hem ÜSTE hem ALTA taşan işaretler var:
        //   ğ ü ö İ  → harfin üstünde     ·  Ç ç Ş ş  → harfin altında
        // "Çocuğunuz" tek kelimede ikisini birden barındırıyor. 1.02'de
        // ğ'nin şapkası ile Ç'nin kuyruğu satır kutusuna sığmıyor, üstelik
        // .mark vurgusunun zemin kutusu komşu satıra biniyordu.
        'display-sm': [
          'clamp(1.9rem, 1.5rem + 1.8vw, 2.85rem)',
          { lineHeight: '1.18', letterSpacing: '-0.03em' },
        ],
        'display-md': [
          'clamp(2.4rem, 1.75rem + 3vw, 4rem)',
          { lineHeight: '1.14', letterSpacing: '-0.035em' },
        ],
        'display-lg': [
          'clamp(2.9rem, 1.9rem + 4.6vw, 5.25rem)',
          { lineHeight: '1.12', letterSpacing: '-0.04em' },
        ],
      },
      borderRadius: {
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15,18,22,0.05)',
        lift: '0 8px 30px -12px rgba(15,18,22,0.18)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        float: 'float 5s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
