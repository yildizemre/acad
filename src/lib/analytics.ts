// ─────────────────────────────────────────────────────────────────────────────
// ANALİTİK
//
// Sağlayıcıya bağımlı değil: .env dosyasına anahtar koyulmadığı sürece hiçbir
// script yüklenmez ve hiçbir istek gitmez. Anahtar eklendiğinde otomatik açılır.
//
//   .env.local
//   VITE_PLAUSIBLE_DOMAIN=hypeacademia.com     ← önerilen (çerezsiz, KVKK dostu)
//   VITE_GA_ID=G-XXXXXXXXXX                    ← alternatif
// ─────────────────────────────────────────────────────────────────────────────

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

/** Uygulama açılırken bir kez çağrılır. Anahtar yoksa hiçbir şey yapmaz. */
export function initAnalytics(): void {
  if (started || typeof document === 'undefined') return;
  started = true;

  if (PLAUSIBLE_DOMAIN) {
    const s = document.createElement('script');
    s.defer = true;
    s.dataset.domain = PLAUSIBLE_DOMAIN;
    // Tek sayfa uygulama olduğu için manuel sayfa görüntüleme sürümü
    s.src = 'https://plausible.io/js/script.manual.js';
    document.head.appendChild(s);
  }

  if (GA_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    // Rota değişimlerini kendimiz bildiriyoruz
    window.gtag('config', GA_ID, { send_page_view: false });
  }
}

/** Rota değiştiğinde sayfa görüntüleme bildirir. */
export function trackPageView(path: string): void {
  window.plausible?.('pageview', { props: { path } });
  if (GA_ID) window.gtag?.('event', 'page_view', { page_path: path });
}

/**
 * Dönüşüm olayları. İsimler sabit tutuldu ki panelde tutarlı okunsun.
 * Asıl değerli olan bunlar — "hangi adımda kaybediyoruz" sorusunu bunlar yanıtlıyor.
 */
export type EventName =
  | 'form_gonderildi'
  | 'whatsapp_tiklandi'
  | 'telefon_tiklandi'
  | 'kurs_goruntulendi'
  | 'mufredat_haftasi_acildi'
  | 'fiyat_hesaplandi'
  | 'panel_girisi_tiklandi'
  | 'kampanya_gosterildi'
  | 'kampanya_tiklandi';

export function track(event: EventName, props: Record<string, string | number> = {}): void {
  const clean = Object.fromEntries(
    Object.entries(props).filter(([, v]) => v !== '' && v !== undefined),
  );
  window.plausible?.(event, { props: clean });
  if (GA_ID) window.gtag?.('event', event, clean);

  if (import.meta.env.DEV) {
    // Geliştirme sırasında olayların doğru tetiklendiğini görebilmek için
    console.debug('[analitik]', event, clean);
  }
}
