// ─────────────────────────────────────────────────────────────────────────────
// GÜNLÜK SATIŞ RAPORU
//
// Her sabah 07:00'de (TSİ) çalışır ve son 24 saatin özetini e-posta olarak
// gönderir. Üç soruyu cevaplar:
//
//   1. Ne sattık?            → tamamlanan ödemeler, ciro, kaynak dağılımı
//   2. Kim yarıda bıraktı?   → ödeme ekranına gelip tamamlamayanlar
//                              (ad + telefon ile — ARANACAK LİSTE budur)
//   3. Nerede kaybettik?     → başarısız ödemeler ve banka gerekçeleri
//
// Yarıda kalan kayıtlar raporun en değerli kısmı: o kişi kursu seçmiş, bilgisini
// girmiş, ödeme ekranına kadar gelmiş. Bir telefon çoğunu geri getirir.
//
// Zamanlama: Netlify cron UTC ile çalışır. 04:00 UTC = 07:00 TSİ.
// Adres:     scheduled — dışarıdan çağrılmaz.
// ─────────────────────────────────────────────────────────────────────────────

import { siparisleriListele, type Siparis } from '../lib/siparis.js';
import { SITE } from '../../src/data/site.js';

/** Ödeme ekranına gelip bu süre içinde sonuçlanmayan sipariş "yarıda kalmış" sayılır. */
const YARIDA_KALMA_DK = 45;

function tl(kurus: number): string {
  return (kurus / 100).toLocaleString('tr-TR', { minimumFractionDigits: 0 }) + ' TL';
}

function saat(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** "instagram.com → 3 · doğrudan → 1" biçiminde kaynak dağılımı. */
function kaynakDagilimi(liste: Siparis[]): string {
  const sayac = new Map<string, number>();
  for (const s of liste) sayac.set(s.kaynak || 'bilinmiyor', (sayac.get(s.kaynak || 'bilinmiyor') ?? 0) + 1);
  if (sayac.size === 0) return '—';
  return [...sayac.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k} → ${n}`)
    .join(' · ');
}

function satirlar(liste: Siparis[], tutarAlani: 'tutarKurus' | 'odenenKurus'): string {
  if (liste.length === 0) return '  (yok)';
  return liste
    .map((s) => {
      const tutar = tutarAlani === 'odenenKurus' ? (s.odenenKurus ?? s.tutarKurus) : s.tutarKurus;
      const hata = s.hataMesaji ? `  · ${s.hataMesaji}` : '';
      return (
        `  ${saat(s.olusturuldu)}  ${s.adSoyad} · ${s.telefon}\n` +
        `      ${s.kursAdi} / ${s.paketAdi} / ${s.planAdi} — ${tl(tutar)}\n` +
        `      kaynak: ${s.kaynak || 'bilinmiyor'} · giriş: ${s.girisSayfasi || '/'}` +
        `${hata}\n` +
        `      ${s.email} · sipariş ${s.siparisNo}`
      );
    })
    .join('\n\n');
}

export default async () => {
  const simdi = new Date();
  const dun = new Date(simdi.getTime() - 24 * 60 * 60 * 1000);

  let hepsi: Siparis[];
  try {
    hepsi = await siparisleriListele(dun);
  } catch (e) {
    console.error('[gunluk-rapor] siparişler okunamadı', e);
    return new Response('Depo okunamadı', { status: 500 });
  }

  const basarili = hepsi.filter((s) => s.durum === 'basarili');
  const basarisiz = hepsi.filter((s) => s.durum === 'basarisiz');

  // "Beklemede" kalan ama üzerinden yeterince zaman geçmiş olanlar: ödeme
  // ekranına gelip tamamlamamışlar. Yeni başlamış olanları listeye almıyoruz,
  // onlar hâlâ ödeme yapıyor olabilir.
  const esik = new Date(simdi.getTime() - YARIDA_KALMA_DK * 60 * 1000);
  const yaridaKalan = hepsi.filter(
    (s) => s.durum === 'beklemede' && new Date(s.olusturuldu) < esik,
  );

  const ciro = basarili.reduce((n, s) => n + (s.odenenKurus ?? s.tutarKurus), 0);
  const kacan = yaridaKalan.reduce((n, s) => n + s.tutarKurus, 0);

  // Hiç hareket yoksa boş rapor göndermiyoruz — her sabah gelen boş e-posta
  // okunmaz hâle gelir ve gerçekten önemli olanı da kaçırırsınız.
  if (hepsi.length === 0) {
    console.info('[gunluk-rapor] son 24 saatte hareket yok, e-posta gönderilmedi');
    return new Response('OK — hareket yok', { status: 200 });
  }

  const ozet =
    `Son 24 saat\n` +
    `${'─'.repeat(52)}\n` +
    `  Tamamlanan satış : ${basarili.length} adet · ${tl(ciro)}\n` +
    `  Yarıda kalan     : ${yaridaKalan.length} adet · ${tl(kacan)} kaçan ciro\n` +
    `  Başarısız ödeme  : ${basarisiz.length} adet\n` +
    `  Ödeme ekranına gelen toplam: ${hepsi.length}\n` +
    (hepsi.length > 0
      ? `  Dönüşüm: %${Math.round((basarili.length / hepsi.length) * 100)}\n`
      : '') +
    `\n  Kaynaklar (tümü): ${kaynakDagilimi(hepsi)}\n` +
    `  Kaynaklar (satan): ${kaynakDagilimi(basarili)}\n`;

  const govde =
    ozet +
    `\n\nSATILDI (${basarili.length})\n${'─'.repeat(52)}\n` +
    satirlar(basarili, 'odenenKurus') +
    `\n\n\nYARIDA KALDI — ARANACAK LİSTE (${yaridaKalan.length})\n${'─'.repeat(52)}\n` +
    `Bu kişiler kursu seçti, bilgilerini girdi, ödeme ekranına kadar geldi ve\n` +
    `tamamlamadı. Aramaya değer.\n\n` +
    satirlar(yaridaKalan, 'tutarKurus') +
    `\n\n\nBAŞARISIZ ÖDEME (${basarisiz.length})\n${'─'.repeat(52)}\n` +
    satirlar(basarisiz, 'tutarKurus') +
    `\n\n${'─'.repeat(52)}\n` +
    `${SITE.url}/kayit · rapor ${saat(simdi.toISOString())}\n`;

  const siteUrl = (process.env.URL ?? SITE.url).replace(/\/$/, '');
  const alanlar = new URLSearchParams({
    'form-name': 'gunluk-rapor',
    tarih: simdi.toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' }),
    satis: String(basarili.length),
    ciro: tl(ciro),
    yaridaKalan: String(yaridaKalan.length),
    kacanCiro: tl(kacan),
    basarisiz: String(basarisiz.length),
    kaynaklar: kaynakDagilimi(hepsi),
    rapor: govde,
  });

  const yanit = await fetch(siteUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: alanlar.toString(),
  });

  if (!yanit.ok) {
    console.error('[gunluk-rapor] e-posta gönderilemedi', yanit.status);
    return new Response('Gönderilemedi', { status: 500 });
  }

  console.info(
    `[gunluk-rapor] gönderildi — ${basarili.length} satış, ${yaridaKalan.length} yarıda kalan`,
  );
  return new Response('OK', { status: 200 });
};

// 04:00 UTC = 07:00 Türkiye saati
export const config = { schedule: '0 4 * * *' };
