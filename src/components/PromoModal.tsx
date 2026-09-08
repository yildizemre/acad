import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowRight, Gift } from 'lucide-react';
import { PROMO } from '../data/promo';
import { track } from '../lib/analytics';

/**
 * Site açıldığında çıkan kampanya penceresi.
 *
 * KURALLAR
 * --------
 *  · İçeriğin tamamı `src/data/promo.ts` içinde; kampanyayı kapatmak için
 *    orada `active: false` demek yeterli.
 *  · Bir kez kapatan ziyaretçiye `hideDays` gün boyunca bir daha çıkmaz.
 *    Tercih localStorage'da tutulur; okunamazsa (gizli sekme, engellenmiş
 *    depolama) pencere yine de çalışır, sadece hatırlamaz.
 *  · Ödeme ve sözleşme sayfalarında hiç açılmaz — orada karar verilmiş olur.
 *  · Esc ile kapanır, odak pencerenin içinde kalır, arkadaki sayfa kaydırılmaz.
 */

const KEY = `promo:${PROMO.id}`;

function dahaOnceKapatildi(): boolean {
  try {
    const t = window.localStorage.getItem(KEY);
    if (!t) return false;
    return Date.now() - Number(t) < PROMO.hideDays * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function kapatildiYaz() {
  try {
    window.localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* depolama engelliyse sorun değil */
  }
}

export default function PromoModal() {
  const { pathname } = useLocation();
  const [acik, setAcik] = useState(false);
  const kutu = useRef<HTMLDivElement>(null);
  const kapatDugmesi = useRef<HTMLButtonElement>(null);

  const gizli = PROMO.hideOn.some((p) => pathname.startsWith(p));

  const kapat = useCallback(() => {
    setAcik(false);
    kapatildiYaz();
  }, []);

  // Açılış: sadece ilk yüklemede, gecikmeli
  useEffect(() => {
    if (!PROMO.active || gizli || dahaOnceKapatildi()) return;
    const t = window.setTimeout(() => {
      setAcik(true);
      track('kampanya_gosterildi', { kampanya: PROMO.id });
    }, PROMO.delayMs);
    return () => window.clearTimeout(t);
    // Yalnızca ilk yüklemede kurulsun — sayfa değiştikçe tekrar çıkmasın.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc ile kapat, odağı pencerenin içinde tut, arkayı kaydırma
  useEffect(() => {
    if (!acik) return;

    const oncekiOdak = document.activeElement as HTMLElement | null;
    const oncekiOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    kapatDugmesi.current?.focus();

    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        kapat();
        return;
      }
      if (e.key !== 'Tab' || !kutu.current) return;
      const odaklanabilir = kutu.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (odaklanabilir.length === 0) return;
      const ilk = odaklanabilir[0];
      const son = odaklanabilir[odaklanabilir.length - 1];
      if (e.shiftKey && document.activeElement === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && document.activeElement === son) {
        e.preventDefault();
        ilk.focus();
      }
    }

    document.addEventListener('keydown', tus);
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = oncekiOverflow;
      oncekiOdak?.focus?.();
    };
  }, [acik, kapat]);

  if (!acik) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kampanya-baslik"
    >
      {/* Arka plan — tıklanınca kapanır */}
      <button
        type="button"
        aria-label="Duyuruyu kapat"
        onClick={kapat}
        className="absolute inset-0 bg-night-950/60 backdrop-blur-[2px] animate-fade-in"
      />

      <div
        ref={kutu}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-lift
                   animate-fade-in-up max-h-[92vh] overflow-y-auto"
      >
        <button
          ref={kapatDugmesi}
          type="button"
          onClick={kapat}
          aria-label="Duyuruyu kapat"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center
                     rounded-full bg-white/80 text-night-500 transition-colors
                     hover:bg-night-100 hover:text-night-950"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Üst blok */}
        <div className="bg-tint-lime px-7 pb-7 pt-9 sm:px-9">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-night-950">
            <Gift className="h-3.5 w-3.5" />
            {PROMO.eyebrow}
          </p>

          <h2 id="kampanya-baslik" className="text-3xl font-extrabold leading-tight text-night-950">
            {PROMO.titleLead} <span className="mark">{PROMO.titleMark}</span>
          </h2>

          <p className="mt-4 leading-relaxed text-night-700">{PROMO.body}</p>
        </div>

        {/* Maddeler */}
        <div className="px-7 py-6 sm:px-9">
          <ul className="space-y-3.5">
            {PROMO.items.map((it) => (
              <li key={it.label} className="flex items-start gap-4">
                <span
                  className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center
                             rounded-2xl bg-night-950 text-sm font-extrabold text-white"
                >
                  {it.value}
                </span>
                <span className="min-w-0">
                  <span className="block font-extrabold text-night-950">{it.label}</span>
                  <span className="block text-sm leading-relaxed text-night-500">{it.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Link
              to={PROMO.primary.to}
              onClick={() => {
                track('kampanya_tiklandi', { kampanya: PROMO.id, hedef: PROMO.primary.to });
                kapat();
              }}
              className="btn-primary flex-1 justify-center"
            >
              {PROMO.primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={PROMO.secondary.to}
              onClick={() => {
                track('kampanya_tiklandi', { kampanya: PROMO.id, hedef: PROMO.secondary.to });
                kapat();
              }}
              className="btn-ghost flex-1 justify-center"
            >
              {PROMO.secondary.label}
            </Link>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-night-400">{PROMO.footnote}</p>
        </div>
      </div>
    </div>
  );
}
