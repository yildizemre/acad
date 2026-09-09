import { useEffect } from 'react';
import { SITE } from '../data/site';

/**
 * Sayfaya özel schema.org verisini <head> içine ekler, sayfa değişince kaldırır.
 * index.html'deki genel veriler (Organization, WebSite) sabit kalır; bu hook
 * sayfaya özgü olanları (Course, Article, BreadcrumbList, FAQPage) ekler.
 */
export default function useStructuredData(data: object | object[] | null) {
  useEffect(() => {
    if (!data) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-page-schema', 'true');
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [data]);
}

/** Ana sayfadan itibaren kırıntı yolu üretir. */
export function breadcrumb(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Ana Sayfa', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE.url}${t.path}`,
    })),
  };
}
