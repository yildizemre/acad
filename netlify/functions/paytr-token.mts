// ─────────────────────────────────────────────────────────────────────────────
// 1. ADIM — iFrame token üretimi
//
// Tarayıcı buraya "hangi kurs / hangi paket / hangi plan" ve alıcı bilgilerini
// yollar. TUTARI YOLLAMAZ.
//
// ⚠️ Tutar burada, sitenin kendi fiyat verisinden yeniden hesaplanır. Müşteriden
//    gelen bir tutara güvenmek, tarayıcı konsolundan 13.900 TL'yi 1 TL yapmak
//    demektir. Fiyat mantığı tek yerde (src/data/pricing.ts) durduğu için sunucu
//    ile sayfa aynı sonucu üretir.
//
// Adres:  POST /api/paytr/token
// ─────────────────────────────────────────────────────────────────────────────

import type { Context } from '@netlify/functions';
import { COURSES } from '../../src/data/courses.js';
import { TIERS, PAYMENT_PLANS, priceFor, totalFor } from '../../src/data/pricing.js';
import { SITE } from '../../src/data/site.js';
import {
  ayarOku,
  iframeTokenAl,
  sepetKodla,
  siparisNoUret,
} from '../lib/paytr.js';
import { siparisYaz, type Siparis } from '../lib/siparis.js';

/** İşlem zaman aşımı — bu süre içinde tamamlanmayan ödeme düşer (dakika). */
const ZAMAN_ASIMI = 30;

function json(govde: unknown, durum = 200) {
  return new Response(JSON.stringify(govde), {
    status: durum,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/** Basit ve kısıtlı doğrulama — PayTR'ın alan uzunluk sınırlarına da uyar. */
function metin(v: unknown, enFazla: number): string {
  return typeof v === 'string' ? v.trim().slice(0, enFazla) : '';
}

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Telefonu sadece rakama indirger: "0541 862 91 90" → "05418629190" */
function telefonSadelestir(v: string): string {
  return v.replace(/\D/g, '').slice(0, 20);
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return json({ hata: 'Yalnızca POST' }, 405);

  let ayar;
  try {
    ayar = ayarOku();
  } catch (e) {
    // Anahtarlar tanımlı değilken müşteriye teknik ayrıntı göstermiyoruz,
    // ama sunucu günlüğünde tam mesaj dursun.
    console.error('[paytr-token] yapılandırma', e);
    return json({ hata: 'Ödeme altyapısı henüz yapılandırılmadı.' }, 503);
  }

  let govde: Record<string, unknown>;
  try {
    govde = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ hata: 'Geçersiz istek gövdesi' }, 400);
  }

  // ─── Seçim doğrulama ───────────────────────────────────────────────────────
  const course = COURSES.find((c) => c.id === govde.kursId);
  const tier = TIERS.find((t) => t.id === govde.paketId);
  const plan = PAYMENT_PLANS.find((p) => p.id === govde.planId);

  if (!course || !tier || !plan) {
    return json({ hata: 'Kurs, paket veya ödeme planı seçimi geçersiz.' }, 400);
  }

  if (plan.onlineOdeme === false) {
    return json(
      { hata: `"${plan.name}" planı online ödemeye kapalı. Lütfen bizimle iletişime geçin.` },
      400,
    );
  }

  // ─── Alıcı bilgileri ───────────────────────────────────────────────────────
  const adSoyad = metin(govde.adSoyad, 60);
  const email = metin(govde.email, 100).toLowerCase();
  const telefon = telefonSadelestir(metin(govde.telefon, 30));
  const adres = metin(govde.adres, 400);
  const ogrenciAdi = metin(govde.ogrenciAdi, 60);
  const ogrenciYasi = metin(govde.ogrenciYasi, 3);
  const not = metin(govde.not, 500);

  const eksik = [
    adSoyad.length < 3 && 'ad soyad',
    !EPOSTA.test(email) && 'e-posta',
    telefon.length < 10 && 'telefon',
    adres.length < 10 && 'adres',
    ogrenciAdi.length < 2 && 'öğrenci adı',
  ].filter(Boolean);

  if (eksik.length) {
    return json({ hata: `Eksik veya hatalı alan: ${eksik.join(', ')}` }, 400);
  }

  if (govde.sozlesmeOnay !== true) {
    return json(
      { hata: 'Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onayı gerekiyor.' },
      400,
    );
  }

  // ─── Tutar — SUNUCUDA hesaplanır ───────────────────────────────────────────
  const liste = priceFor(tier, course);
  const toplam = totalFor(liste, plan);
  const tutarKurus = Math.round(toplam * 100);

  if (!Number.isSafeInteger(tutarKurus) || tutarKurus <= 0) {
    console.error('[paytr-token] tutar hesaplanamadı', { liste, toplam });
    return json({ hata: 'Tutar hesaplanamadı.' }, 500);
  }

  // ─── Taksit ────────────────────────────────────────────────────────────────
  // Tek çekim planında taksit hiç gösterilmez. Diğerlerinde müşteri, planında
  // yazandan daha uzun vadeye geçemesin diye üst sınır konuyor.
  const tekCekim = plan.installments <= 1;
  const taksitYok: '0' | '1' = tekCekim ? '1' : '0';
  const enFazlaTaksit = tekCekim ? '0' : String(Math.min(plan.installments, 12));

  // ─── Müşteri IP'si ─────────────────────────────────────────────────────────
  // PayTR bunu imzaya dahil ediyor; boş veya yanlış giderse token alınamaz.
  const ip =
    req.headers.get('x-nf-client-connection-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    context.ip ??
    '';

  const siteUrl = (process.env.URL ?? SITE.url).replace(/\/$/, '');
  const siparisNo = siparisNoUret();

  const sepetB64 = sepetKodla([
    {
      ad: `${course.title} — ${tier.name} paketi (${course.weeks} hafta)`,
      tutar: toplam.toFixed(2),
      adet: 1,
    },
  ]);

  // Siparişi ÖNCE yazıyoruz: bildirim (2. ADIM) token isteğinden önce bile
  // ulaşsa kaydı bulabilsin.
  const siparis: Siparis = {
    siparisNo,
    durum: 'beklemede',
    olusturuldu: new Date().toISOString(),
    kursId: course.id,
    kursAdi: course.title,
    paketId: tier.id,
    paketAdi: tier.name,
    planId: plan.id,
    planAdi: plan.name,
    taksitSayisi: plan.installments,
    tutarKurus,
    adSoyad,
    email,
    telefon,
    adres,
    ogrenciAdi,
    ogrenciYasi,
    not,
  };

  try {
    await siparisYaz(siparis);
  } catch (e) {
    // Depo yazılamıyorsa ödeme almıyoruz: bildirim geldiğinde siparişi
    // eşleştiremeyeceğimiz için müşteri ödeme yapıp kaydı açılmamış olurdu.
    console.error('[paytr-token] sipariş yazılamadı', e);
    return json({ hata: 'Sipariş kaydı oluşturulamadı, lütfen tekrar deneyin.' }, 500);
  }

  const sonuc = await iframeTokenAl(ayar, {
    siparisNo,
    tutarKurus,
    email,
    adSoyad,
    telefon,
    adres,
    sepetB64,
    musteriIp: ip,
    taksitYok,
    enFazlaTaksit,
    basariliUrl: `${siteUrl}/odeme-sonucu?durum=basarili&no=${siparisNo}`,
    hataUrl: `${siteUrl}/odeme-sonucu?durum=hata&no=${siparisNo}`,
    zamanAsimi: ZAMAN_ASIMI,
  });

  if (!sonuc.ok) {
    console.error('[paytr-token] token alınamadı', sonuc.hata);
    return json({ hata: sonuc.hata ?? 'Ödeme formu açılamadı.' }, 502);
  }

  return json({
    token: sonuc.token,
    siparisNo,
    tutar: toplam,
    testModu: ayar.testMode === '1',
  });
};

export const config = { path: '/api/paytr/token' };
