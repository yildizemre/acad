// ─────────────────────────────────────────────────────────────────────────────
// AÇILIŞ DUYURUSU (POPUP)
//
// Site açıldığında çıkan kampanya penceresinin tüm içeriği burada. Kampanyayı
// bitirmek için tek yapılması gereken `active` alanını `false` yapmak — kodda
// hiçbir yere dokunmaya gerek yok.
//
// ⚠️  Buradaki her madde sitenin başka bir yerinde de yazılı olmalı. Yalnızca
//     popup'ta duran, fiyat sayfasında karşılığı olmayan bir indirim vaadi
//     hem güven kırar hem 6502 sayılı Kanun açısından sıkıntı çıkarır.
//     Aşağıdaki üç madde pricing.ts içindeki DISCOUNTS ve PAYMENT_PLANS ile
//     birebir aynıdır.
// ─────────────────────────────────────────────────────────────────────────────

export interface PromoItem {
  /** Sol taraftaki büyük rakam veya oran */
  value: string;
  label: string;
  detail: string;
}

export interface Promo {
  /** Kapatmak için tek yapılacak şey: bunu false yapın */
  active: boolean;
  /**
   * Duyurunun kimliği. Metni değiştirip herkese yeniden göstermek isterseniz
   * bu değeri de değiştirin — daha önce kapatmış ziyaretçilere tekrar çıkar.
   */
  id: string;
  eyebrow: string;
  /** Başlıkta fosforlu vurgulanacak kısım ayrı yazılır */
  titleLead: string;
  titleMark: string;
  body: string;
  items: PromoItem[];
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  /** Alt satırdaki küçük yazı — koşul varsa burada söylenir */
  footnote: string;
  /** Kapatıldıktan sonra kaç gün boyunca bir daha gösterilmesin */
  hideDays: number;
  /** Sayfa açıldıktan kaç milisaniye sonra çıksın */
  delayMs: number;
  /** Bu adreslerde hiç gösterilmez — ödeme ve sözleşme sayfaları */
  hideOn: string[];
}

export const PROMO: Promo = {
  active: true,
  id: 'donem-basi-2026',
  eyebrow: 'Yeni dönem kayıtları açıldı',
  titleLead: 'Erken kayıtta',
  titleMark: '%10 indirim',
  body:
    'Dönem başlamadan en az 3 hafta önce kayıt olan öğrenciler indirimli fiyattan yararlanır. Karar vermeden önce ücretsiz deneme dersine katılabilirsiniz — kart bilgisi istemiyoruz.',
  items: [
    {
      value: '%10',
      label: 'Erken kayıt indirimi',
      detail: 'Dönem başından 3 hafta önce kayıt olan herkes için',
    },
    {
      value: '%15',
      label: 'Kardeş indirimi',
      detail: 'Aynı aileden ikinci ve sonraki öğrencilerde, süresiz',
    },
    {
      value: '9x',
      label: 'Faizsiz taksit',
      detail: 'Anlaşmalı banka kartlarına vade farksız',
    },
  ],
  primary: { label: 'Ücretsiz deneme dersi al', to: '/iletisim' },
  secondary: { label: 'Fiyatları incele', to: '/fiyatlar' },
  footnote:
    'Yüzdelik indirimlerden yalnızca en yüksek olan uygulanır; kardeş indirimi bunun istisnasıdır ve üzerine eklenir. İlk 2 ders içinde koşulsuz iade hakkınız her koşulda geçerlidir.',
  hideDays: 7,
  delayMs: 2500,
  hideOn: ['/kayit', '/yasal'],
};
