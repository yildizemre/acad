import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, MessageCircle } from 'lucide-react';
import { SITE, WA_URL } from '../data/site';
import { formatTRY } from '../data/pricing';
import { siparisDurumuSor, type SiparisDurumYaniti } from '../lib/payment';
import usePageMeta from '../hooks/usePageMeta';

/**
 * Ödeme sonuç sayfası — PayTR'ın merchant_ok_url / merchant_fail_url hedefi.
 *
 * ⚠️ PayTR bu sayfaya HİÇBİR VERİ POST ETMEZ ve müşteri buraya geldiğinde
 *    ödeme henüz kesinleşmemiş olabilir (doküman 1. ADIM, "ÖNEMLİ UYARI").
 *    Kesin sonuç arka planda Bildirim URL'ye gelir. Bu yüzden burada sipariş
 *    onaylanmaz; yalnızca gerçek durum sunucudan sorulur ve gösterilir.
 */

/** Sonuç birkaç saniye gecikebildiği için kısa aralıklarla yokluyoruz. */
const YOKLAMA_ARALIGI = 2000;
const EN_FAZLA_YOKLAMA = 15; // ~30 saniye

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const siparisNo = params.get('no') ?? '';
  const beklenen = params.get('durum'); // PayTR'ın yönlendirdiği yol — bilgi amaçlı

  const [siparis, setSiparis] = useState<SiparisDurumYaniti | null>(null);
  const [bekliyor, setBekliyor] = useState(true);
  const [zamanAsimi, setZamanAsimi] = useState(false);
  const sayac = useRef(0);

  usePageMeta({
    title: 'Ödeme Sonucu | Hype Academia',
    description: 'Ödeme işleminizin sonucu.',
    noindex: true,
  });

  useEffect(() => {
    if (!siparisNo) {
      setBekliyor(false);
      return;
    }

    let durduruldu = false;
    let zamanlayici: number;

    async function yokla() {
      const veri = await siparisDurumuSor(siparisNo);
      if (durduruldu) return;

      if (veri) setSiparis(veri);

      // Sonuç kesinleştiyse dur.
      if (veri && veri.durum !== 'beklemede') {
        setBekliyor(false);
        return;
      }

      sayac.current += 1;
      if (sayac.current >= EN_FAZLA_YOKLAMA) {
        setBekliyor(false);
        setZamanAsimi(true);
        return;
      }

      zamanlayici = window.setTimeout(yokla, YOKLAMA_ARALIGI);
    }

    yokla();
    return () => {
      durduruldu = true;
      window.clearTimeout(zamanlayici);
    };
  }, [siparisNo]);

  const basarili = siparis?.durum === 'basarili';
  const basarisiz = siparis?.durum === 'basarisiz' || (!siparis && beklenen === 'hata');

  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          {/* ── Bekleme ── */}
          {bekliyor && (
            <div className="rounded-3xl bg-night-50 p-8 text-center md:p-12">
              <Loader2 className="mx-auto mb-6 h-10 w-10 animate-spin text-night-400" />
              <h1 className="text-display-sm text-night-950">Ödemeniz doğrulanıyor</h1>
              <p className="mx-auto mt-5 max-w-md leading-relaxed text-night-600">
                Bankanızdan gelen sonucu bekliyoruz. Bu birkaç saniye sürebilir — lütfen
                sayfayı kapatmayın.
              </p>
            </div>
          )}

          {/* ── Başarılı ── */}
          {!bekliyor && basarili && siparis && (
            <div className="rounded-3xl bg-tint-mint p-8 md:p-12">
              <CheckCircle2 className="mb-6 h-12 w-12 text-night-950" />
              <h1 className="text-display-sm text-night-950">
                Kaydınız <span className="mark">alındı</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-night-700">
                Ödemeniz onaylandı. Kayıt ekibimiz <strong>1 iş günü içinde</strong> arayarak
                ders saatinizi belirleyecek ve öğrenci paneli erişiminizi açacak.
              </p>

              {siparis.testMi && (
                <p className="mt-6 rounded-2xl bg-white p-4 text-sm font-bold text-night-950">
                  Bu bir TEST işlemidir — gerçek tahsilat yapılmamıştır.
                </p>
              )}

              <dl className="mt-8 space-y-2.5 border-t border-night-950/10 pt-6 text-sm">
                {[
                  ['Sipariş no', siparis.siparisNo],
                  ['Kurs', siparis.kurs],
                  ['Paket', siparis.paket],
                  ['Ödeme planı', siparis.plan],
                  [
                    'Tahsil edilen',
                    formatTRY(siparis.tahsilEdilen ?? siparis.tutar),
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-night-600">{k}</dt>
                    <dd className="text-right font-bold text-night-950">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-sm leading-relaxed text-night-600">
                Fatura ve ödeme dekontu {SITE.email} adresinden e-postanıza gönderilir. Sipariş
                numaranızı saklayın; bize yazarken işimizi kolaylaştırır.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/" className="btn-primary">
                  Ana sayfaya dön
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp&apos;tan yaz
                </a>
              </div>
            </div>
          )}

          {/* ── Başarısız ── */}
          {!bekliyor && basarisiz && (
            <div className="rounded-3xl bg-tint-rose p-8 md:p-12">
              <XCircle className="mb-6 h-12 w-12 text-night-950" />
              <h1 className="text-display-sm text-night-950">Ödeme tamamlanamadı</h1>
              <p className="mt-5 text-lg leading-relaxed text-night-700">
                {siparis?.hataMesaji
                  ? siparis.hataMesaji
                  : 'İşlem bankanız tarafından onaylanmadı veya yarıda kaldı.'}
              </p>
              <p className="mt-4 leading-relaxed text-night-700">
                Kartınızdan <strong>herhangi bir tahsilat yapılmadı</strong>. Tekrar
                deneyebilir veya bize yazarak farklı bir ödeme yolu ayarlayabilirsiniz.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/kayit" className="btn-primary">
                  Tekrar dene
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <MessageCircle className="h-4 w-4" />
                  Yardım iste
                </a>
              </div>
            </div>
          )}

          {/* ── Sonuç hâlâ gelmediyse ── */}
          {!bekliyor && !basarili && !basarisiz && (
            <div className="rounded-3xl bg-night-50 p-8 md:p-12">
              <h1 className="text-display-sm text-night-950">Sonuç henüz kesinleşmedi</h1>
              <p className="mt-5 leading-relaxed text-night-600">
                {zamanAsimi
                  ? 'Bankanızdan gelen sonuç beklenenden uzun sürdü. Ödemeniz alındıysa kayıt ekibimiz sizinle iletişime geçecek — aynı ödemeyi tekrar yapmayın.'
                  : 'Sipariş bilgisine ulaşılamadı. Ödeme yaptıysanız kayıt ekibimiz sizinle iletişime geçecek.'}
              </p>
              {siparisNo && (
                <p className="mt-5 text-sm text-night-500">
                  Sipariş no: <span className="font-mono text-night-950">{siparisNo}</span>
                </p>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <MessageCircle className="h-4 w-4" />
                  Durumu sor
                </a>
                <Link to="/" className="btn-ghost">
                  Ana sayfaya dön
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
