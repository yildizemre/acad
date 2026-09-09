// ─────────────────────────────────────────────────────────────────────────────
// ZİYARETÇİ KAYNAĞI
//
// "Bu kayıt nereden geldi?" sorusunun cevabı. Ziyaretçi siteye İLK girdiğinde
// kaynağı yakalayıp saklıyoruz; kayıt formuna geldiğinde adres çubuğunda artık
// utm parametreleri olmasa bile ilk kaynağı biliyoruz.
//
// Neden sessionStorage: aynı ziyaret boyunca kalsın, kapatınca silinsin.
// Kalıcı bir çerez koymuyoruz — KVKK açısından gereksiz veri toplamıyoruz,
// çerez banneri gerektirmiyor.
//
// ⚠️ Burada kişisel veri saklanmaz: yalnızca hangi siteden/kampanyadan
//    gelindiği tutulur.
// ─────────────────────────────────────────────────────────────────────────────

const ANAHTAR = 'kaynak';

/** Kendi alan adımızdan gelen gezinmeler kaynak sayılmaz. */
function kendiSitemizMi(referrer: string): boolean {
  try {
    return new URL(referrer).hostname === window.location.hostname;
  } catch {
    return false;
  }
}

/** "instagram.com" · "google" · "doğrudan" gibi okunur bir etiket üretir. */
function etiketle(): string {
  const p = new URLSearchParams(window.location.search);

  // Kampanya bağlantısı varsa en güvenilir bilgi odur
  const utmSource = p.get('utm_source');
  const utmMedium = p.get('utm_medium');
  const utmCampaign = p.get('utm_campaign');
  if (utmSource) {
    return [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ');
  }

  // WhatsApp, Instagram gibi uygulamalar bazen yalnızca kendi kısa etiketini koyar
  const ref = document.referrer;
  if (!ref) return 'doğrudan';
  if (kendiSitemizMi(ref)) return 'doğrudan';

  try {
    return new URL(ref).hostname.replace(/^www\./, '');
  } catch {
    return 'bilinmiyor';
  }
}

/**
 * Uygulama açılışında bir kez çağrılır. Kaynak zaten kayıtlıysa dokunmaz —
 * ilk temas noktası korunur.
 */
export function kaynagiYakala(): void {
  try {
    if (window.sessionStorage.getItem(ANAHTAR)) return;
    window.sessionStorage.setItem(ANAHTAR, etiketle());
  } catch {
    /* depolama engelliyse kaynak bilinmez, akış bozulmaz */
  }
}

/** Kayıt sırasında siparişe yazılacak kaynak etiketi. */
export function kaynagiOku(): string {
  try {
    return window.sessionStorage.getItem(ANAHTAR) ?? 'bilinmiyor';
  } catch {
    return 'bilinmiyor';
  }
}

/** Ziyaretçinin kayıt formuna hangi sayfadan geldiği — huninin son adımı. */
export function girisSayfasi(): string {
  try {
    return window.sessionStorage.getItem('girisSayfasi') ?? '/';
  } catch {
    return '/';
  }
}

/** İlk açılan sayfayı saklar (ana sayfa mı, kurs sayfası mı, blog mu?). */
export function girisSayfasiniYakala(): void {
  try {
    if (window.sessionStorage.getItem('girisSayfasi')) return;
    window.sessionStorage.setItem('girisSayfasi', window.location.pathname);
  } catch {
    /* yok sayılır */
  }
}
