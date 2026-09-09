// ─────────────────────────────────────────────────────────────────────────────
// SİPARİŞ DURUMU
//
// merchant_ok_url'e PayTR hiçbir veri POST etmez (doküman 1. ADIM, "ÖNEMLİ
// UYARI"). Müşteri o sayfaya geldiğinde ödemenin kesin sonucu henüz belli
// olmayabilir — sonuç, bildirim URL'ye arka planda gelir.
//
// Bu uç, sonuç sayfasının "ödemeniz onaylandı" diyebilmesi için siparişin
// gerçek durumunu depodan okur. Sayfa bunu birkaç saniye arayla yoklar.
//
// ⚠️ Yalnızca gösterilmesi gereken alanlar döner; adres, telefon, e-posta gibi
//    kişisel veriler bu uçtan ASLA çıkmaz.
//
// Adres:  GET /api/paytr/durum?no=<siparisNo>
// ─────────────────────────────────────────────────────────────────────────────

import { siparisNoGecerliMi } from '../lib/paytr.js';
import { siparisOku } from '../lib/siparis.js';

function json(govde: unknown, durum = 200) {
  return new Response(JSON.stringify(govde), {
    status: durum,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export default async (req: Request) => {
  const no = new URL(req.url).searchParams.get('no') ?? '';
  if (!siparisNoGecerliMi(no)) return json({ hata: 'Geçersiz sipariş numarası' }, 400);

  let siparis;
  try {
    siparis = await siparisOku(no);
  } catch (e) {
    console.error('[paytr-durum] okunamadı', no, e);
    return json({ hata: 'Sipariş durumu okunamadı' }, 500);
  }

  if (!siparis) return json({ hata: 'Sipariş bulunamadı' }, 404);

  return json({
    siparisNo: siparis.siparisNo,
    durum: siparis.durum,
    kurs: siparis.kursAdi,
    paket: siparis.paketAdi,
    plan: siparis.planAdi,
    tutar: siparis.tutarKurus / 100,
    tahsilEdilen: siparis.odenenKurus ? siparis.odenenKurus / 100 : null,
    hataMesaji: siparis.hataMesaji ?? null,
    testMi: siparis.testMi ?? false,
  });
};

export const config = { path: '/api/paytr/durum' };
