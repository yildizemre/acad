import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Bölüm numarası — "01", "02"... Editöryel ritmi kuran şey bu. */
  index?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Varsayılan hizalama SOLA yaslı. Her bölümü ortalayıp
 * üst başlık + başlık + alt başlık dizmek siteyi şablon gibi gösteriyordu.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  index,
  align = 'left',
  tone = 'light',
  className = '',
}: Props) {
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <Reveal className={centered ? `text-center mx-auto max-w-2xl ${className}` : className}>
      {(eyebrow || index) && (
        <div
          className={`flex items-center gap-3 mb-5 ${centered ? 'justify-center' : ''}`}
        >
          {index && (
            <span
              className={`font-mono text-xs tracking-widest ${
                dark ? 'text-sand-500' : 'text-lead-400'
              }`}
            >
              {index}
            </span>
          )}
          <span className={`h-px w-8 ${dark ? 'bg-sand-50/25' : 'bg-sand-400'}`} />
          {eyebrow && (
            <span
              className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                dark ? 'text-sand-400' : 'text-lead-500'
              }`}
            >
              {eyebrow}
            </span>
          )}
        </div>
      )}

      <h2
        className={`font-display text-display-sm font-semibold ${
          dark ? 'text-sand-50' : 'text-ink-950'
        } ${centered ? '' : 'max-w-2xl'}`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed max-w-2xl ${
            dark ? 'text-sand-300' : 'text-lead-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
