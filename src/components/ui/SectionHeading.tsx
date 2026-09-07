import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Eski düzenden kalan alan — artık kullanılmıyor, uyum için duruyor */
  index?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Bölüm başlığı. Kodland benzeri düzen: ortalanmış, büyük ve kalın.
 * Numaralı/çizgili editöryel işaretler kaldırıldı.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'light',
  className = '',
}: Props) {
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <Reveal className={centered ? `text-center mx-auto max-w-3xl ${className}` : className}>
      {eyebrow && (
        <p className={`text-sm font-bold mb-4 ${dark ? 'text-night-400' : 'text-night-400'}`}>
          {eyebrow}
        </p>
      )}

      <h2
        className={`text-display-sm font-extrabold ${dark ? 'text-white' : 'text-night-950'} ${
          centered ? '' : 'max-w-3xl'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-5 text-lg leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${
            dark ? 'text-night-300' : 'text-night-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
