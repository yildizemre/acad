import { PAYMENT_PROVIDER } from '../../data/legal-entity';

/**
 * Ödeme güven şeridi: sağlayıcı logosu + kabul edilen kart markaları.
 *
 * Görseller `scripts/odeme-logolari.py` ile üretilir. Sağlayıcı değişirse hem
 * `PAYMENT_PROVIDER` hem de o betik güncellenmeli — bir sağlayıcıyla çalışıp
 * başkasının logosunu göstermek ziyaretçiyi yanıltır.
 */
export default function PaymentBadges({
  tone = 'light',
  className = '',
}: {
  /** Koyu zeminlerde (altbilgi) logoların beyaz sürümü kullanılır. */
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  const logo = dark ? PAYMENT_PROVIDER.logoWhite : PAYMENT_PROVIDER.logo;
  const kartlar = dark ? PAYMENT_PROVIDER.cardsWhite : PAYMENT_PROVIDER.cards;

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      <img
        src={logo}
        alt={`${PAYMENT_PROVIDER.name} ile güvenli ödeme`}
        width={124}
        height={21}
        loading="lazy"
        className="h-5 w-auto"
      />
      <span
        aria-hidden="true"
        className={`hidden h-5 w-px sm:block ${dark ? 'bg-white/20' : 'bg-night-200'}`}
      />
      <img
        src={kartlar}
        alt={`Kabul edilen kartlar: ${PAYMENT_PROVIDER.cardNames.join(', ')}`}
        width={188}
        height={20}
        loading="lazy"
        className="h-5 w-auto"
      />
    </div>
  );
}
