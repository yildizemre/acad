import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, Video, ClipboardCheck, CalendarCheck, Mail } from 'lucide-react';
import { SITE, WA_URL } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';

/**
 * Öğrenci paneli — geçici karşılama sayfası.
 *
 * Panel (panel.hypeacademia.com) henüz yayında değil. Navbar'daki "Giriş Yap"
 * düğmesi oraya gidiyordu ve ölü bağlantı veriyordu. Ödeme alan bir sitede ölü
 * giriş bağlantısı güveni doğrudan kırar; bu sayfa dürüst bir karşılık veriyor:
 * panelde ne olacağını söylüyor ve şu an bu işlerin nasıl yürüdüğünü anlatıyor.
 *
 * Panel yayına alındığında `SITE.panelHazir` true yapılır, `SITE.panelUrl`
 * gerçek adrese çevrilir ve bu sayfa kaldırılabilir.
 */

const OZELLIKLER = [
  {
    icon: CalendarCheck,
    baslik: 'Ders programı ve katılım bağlantısı',
    metin: 'Haftalık ders saatleriniz ve Zoom bağlantınız tek yerde durur.',
  },
  {
    icon: Video,
    baslik: 'Ders kayıtları',
    metin: 'Kaçırdığınız veya tekrar izlemek istediğiniz dersler 12 ay boyunca açık kalır.',
  },
  {
    icon: ClipboardCheck,
    baslik: 'Ödevler ve eğitmen notları',
    metin: 'Verilen ödev, teslim ettiğiniz çalışma ve eğitmenin geri bildirimi bir arada.',
  },
  {
    icon: Mail,
    baslik: 'Aylık gelişim raporu',
    metin: 'Çocuğunuzun neyi öğrendiği, nerede zorlandığı yazılı olarak.',
  },
];

export default function PanelPage() {
  usePageMeta({
    title: 'Öğrenci Paneli | Hype Academia',
    description: 'Hype Academia öğrenci paneli.',
    noindex: true,
  });

  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-tint-sky p-8 md:p-12">
            <p className="eyebrow mb-5">Öğrenci Paneli</p>
            <h1 className="text-display-sm text-night-950">
              Panel <span className="mark">hazırlanıyor</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-night-700">
              Öğrenci panelimiz üzerinde çalışıyoruz. Açıldığında kayıtlı velilerimize
              e-posta ile giriş bilgisi göndereceğiz — ayrıca bir şey yapmanıza gerek yok.
            </p>
            <p className="mt-4 leading-relaxed text-night-700">
              <strong>Bu arada hiçbir şey aksamıyor:</strong> ders saatinizi ve Zoom
              bağlantınızı kayıt görüşmesinde iletiyoruz, ders kayıtlarını ve ödevleri
              eğitmeniniz e-posta ve WhatsApp üzerinden paylaşıyor.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="mb-6 text-xl font-extrabold text-night-950">
              Panel açıldığında burada ne olacak?
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {OZELLIKLER.map((o) => (
                <li key={o.baslik} className="rounded-3xl bg-night-50 p-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-night-950">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1.5 font-extrabold text-night-950">{o.baslik}</h3>
                  <p className="leading-relaxed text-night-600">{o.metin}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-6 rounded-3xl bg-night-50 p-8 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-extrabold text-night-950">
                Ders saatiniz veya kaydınızla ilgili bir şey mi lazım?
              </h2>
              <p className="leading-relaxed text-night-600">
                WhatsApp hattımıza yazın, aynı gün dönüyoruz. Ya da{' '}
                <a
                  href={`tel:${SITE.phoneIntl}`}
                  className="font-bold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500"
                >
                  {SITE.phoneDisplay}
                </a>{' '}
                numarasından arayın.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <Link to="/" className="btn-ghost">
                Ana sayfa
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
