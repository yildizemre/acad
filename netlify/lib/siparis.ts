// ─────────────────────────────────────────────────────────────────────────────
// SİPARİŞ KAYDI
//
// Ödeme akışının iki ucu birbirinden habersiz çalışır:
//   · Token isteği   — müşterinin tarayıcısından tetiklenir
//   · Bildirim (2. ADIM) — PayTR sunucusundan arka planda gelir, oturum yoktur
//
// İkisini birbirine bağlayan tek şey sipariş numarası (merchant_oid). Bu yüzden
// siparişi token aşamasında yazıyoruz; bildirim geldiğinde numaradan buluyoruz.
//
// Depolama: Netlify Blobs (site ile birlikte gelen anahtar-değer deposu, ek
// kurulum veya veritabanı gerektirmez).
//
// ⚠️ TEKRARLAYAN BİLDİRİM: PayTR aynı sipariş için birden fazla bildirim
//    gönderebilir (ağ sorunları vb.). Doküman "yalnızca ilk bildirim göz önünde
//    bulundurulmalı" diyor. `sonuclandir` bunu garanti eder.
// ─────────────────────────────────────────────────────────────────────────────

import { getStore } from '@netlify/blobs';

export type SiparisDurumu = 'beklemede' | 'basarili' | 'basarisiz';

export interface Siparis {
  siparisNo: string;
  durum: SiparisDurumu;
  olusturuldu: string;
  sonuclandi?: string;

  // Seçim
  kursId: string;
  kursAdi: string;
  paketId: string;
  paketAdi: string;
  planId: string;
  planAdi: string;
  taksitSayisi: number;

  /** Sunucuda hesaplanan tutar (kuruş) — müşteriden gelen değere güvenilmez */
  tutarKurus: number;

  // Alıcı
  adSoyad: string;
  email: string;
  telefon: string;
  adres: string;
  ogrenciAdi: string;
  ogrenciYasi: string;
  not: string;

  // Bildirimden gelenler
  odenenKurus?: number;
  odemeTuru?: string;
  hataKodu?: string;
  hataMesaji?: string;
  testMi?: boolean;
}

function depo() {
  return getStore({ name: 'siparisler', consistency: 'strong' });
}

export async function siparisYaz(s: Siparis): Promise<void> {
  await depo().setJSON(s.siparisNo, s);
}

export async function siparisOku(siparisNo: string): Promise<Siparis | null> {
  return (await depo().get(siparisNo, { type: 'json' })) as Siparis | null;
}

/**
 * Siparişi sonuçlandırır.
 *
 * Dönen `ilkKez` değeri, bu bildirimin siparişi ilk kez sonuçlandıran bildirim
 * olup olmadığını söyler. Yalnızca `ilkKez === true` iken bildirim e-postası
 * gönderilmeli; aksi hâlde tekrarlayan bildirimlerde aynı sipariş defalarca
 * kayıt ekibine düşer.
 */
export async function sonuclandir(
  siparisNo: string,
  durum: Exclude<SiparisDurumu, 'beklemede'>,
  ek: Partial<Siparis>,
): Promise<{ ilkKez: boolean; siparis: Siparis | null }> {
  const mevcut = await siparisOku(siparisNo);

  // Sipariş bulunamadı: bildirim yine de OK ile yanıtlanmalı (aksi hâlde PayTR
  // tekrar tekrar dener), ama bunu görebilmemiz için kaydını tutuyoruz.
  if (!mevcut) return { ilkKez: false, siparis: null };

  if (mevcut.durum !== 'beklemede') return { ilkKez: false, siparis: mevcut };

  const guncel: Siparis = {
    ...mevcut,
    ...ek,
    durum,
    sonuclandi: new Date().toISOString(),
  };
  await siparisYaz(guncel);
  return { ilkKez: true, siparis: guncel };
}
