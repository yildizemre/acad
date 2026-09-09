import { useEffect } from 'react';

interface Meta {
  title: string;
  description?: string;
  /** Sayfanın kanonik adresi — verilmezse mevcut adres kullanılır */
  canonical?: string;
  /**
   * Arama motorları bu sayfayı indekslemesin.
   * Ödeme sonucu gibi kişiye özel, tek kullanımlık sayfalar için.
   */
  noindex?: boolean;
}

function setTag(selector: string, create: () => HTMLElement, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  if (el.tagName === 'LINK') el.setAttribute('href', value);
  else el.setAttribute('content', value);
}

/**
 * Tek sayfa uygulamada her rota için başlık ve açıklama etiketlerini günceller.
 * Arama motorlarının her sayfayı ayrı ayrı indeksleyebilmesi için gerekli.
 */
export default function usePageMeta({ title, description, canonical, noindex }: Meta) {
  useEffect(() => {
    document.title = title;

    setTag(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:title');
        return m;
      },
      title,
    );

    if (description) {
      setTag(
        'meta[name="description"]',
        () => {
          const m = document.createElement('meta');
          m.setAttribute('name', 'description');
          return m;
        },
        description,
      );
      setTag(
        'meta[property="og:description"]',
        () => {
          const m = document.createElement('meta');
          m.setAttribute('property', 'og:description');
          return m;
        },
        description,
      );
    }

    // index.html'deki genel robots etiketini geçici olarak değiştiriyoruz.
    // İkinci bir robots etiketi eklemek yerine bunu yapmanın sebebi: aynı
    // sayfada iki robots etiketi bulunması belirsiz bir durum ve arama
    // motorları arasında farklı yorumlanıyor. Sayfadan çıkılınca eski değer
    // geri yazılır.
    const robots = document.head.querySelector('meta[name="robots"]');
    const oncekiRobots = robots?.getAttribute('content') ?? null;
    if (noindex && robots) robots.setAttribute('content', 'noindex, nofollow');

    const href = canonical ?? window.location.origin + window.location.pathname;
    setTag(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      },
      href,
    );
    setTag(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:url');
        return m;
      },
      href,
    );
    return () => {
      if (noindex && robots && oncekiRobots !== null) {
        robots.setAttribute('content', oncekiRobots);
      }
    };
  }, [title, description, canonical, noindex]);
}
