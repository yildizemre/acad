import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Loader2,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { SITE, WA_URL, waLink } from '../data/site';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import { track } from '../lib/analytics';
import BookingEmbed from '../components/BookingEmbed';
import { BOOKING_ENABLED } from '../lib/booking';

const AGES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const PERKS = [
  '1 saatlik gerçek ders — tanıtım sunumu değil',
  'Kart bilgisi istemiyoruz, otomatik abonelik yok',
  'Ders sonunda çocuğunuzun seviyesi hakkında geri bildirim',
  '48 saat içinde sizi arayıp planlıyoruz',
];

export default function ContactPage() {
  const [params] = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState(params.get('kurs') ?? '');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  usePageMeta({
    title: 'Ücretsiz Deneme Dersi & İletişim | Hype Academia',
    description:
      'Formu doldurun, 48 saat içinde sizi arayalım ve çocuğunuz için ücretsiz deneme dersini planlayalım. Kart bilgisi istenmez.',
  });

  const valid = name.trim().length > 1 && phone.trim().length > 5 && age !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid || status === 'sending') return;

    setStatus('sending');
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'deneme-dersi',
          name: name.trim(),
          phone: phone.trim(),
          age,
          course,
          note: note.trim(),
        }).toString(),
      });
    } catch {
      // Ağ hatası olsa bile kullanıcıyı WhatsApp'a yönlendiren teşekkür ekranını gösteriyoruz
    } finally {
      track('form_gonderildi', { yas: age, kurs: course || 'kararsiz' });
      setStatus('done');
    }
  };

  return (
    <>
      <section className="section bg-white /70">
        <div className="container">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_520px] gap-12 items-start">
            {/* ─── Sol: anlatım ─── */}
            <div>
              <Reveal>
                <div className="eyebrow mb-4">
                  Ücretsiz Deneme Dersi
                </div>
                <h1 className="text-display-md text-night-950 mb-5">
                  Önce deneyin, <span className="mark">sonra karar verin</span>
                </h1>
                <p className="text-lg text-night-500 leading-relaxed mb-8">
                  Formu doldurun, 48 saat içinde sizi arayalım. Çocuğunuzun yaşını ve ilgi alanını
                  konuşup en uygun eğitmenle 1 saatlik ücretsiz dersi planlayalım.
                </p>

                <ul className="space-y-3 mb-10">
                  {PERKS.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-night-600">
                      <CheckCircle2 className="w-5 h-5 text-electric-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* İletişim kanalları */}
              <Reveal delay={120}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-hover p-5 flex items-center gap-3"
                  >
                    <span className="w-11 h-11 rounded border border-night-200 text-[#1ebe5d] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-night-400">Hemen yazın</span>
                      <span className="block font-semibold text-night-950">WhatsApp</span>
                    </span>
                  </a>

                  <a
                    href={`tel:${SITE.phoneIntl}`}
                    className="card-hover p-5 flex items-center gap-3"
                  >
                    <span className="w-11 h-11 rounded border border-night-200 text-night-950 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-night-400">Telefon</span>
                      <span className="block font-semibold text-night-950">
                        {SITE.phoneDisplay}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`mailto:${SITE.emailOperations}`}
                    className="card-hover p-5 flex items-center gap-3"
                  >
                    <span className="w-11 h-11 rounded border border-night-200 text-night-950 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-night-400">E-posta</span>
                      <span className="block font-semibold text-night-950 truncate">
                        {SITE.emailOperations}
                      </span>
                    </span>
                  </a>

                  <div className="card p-5 flex items-center gap-3">
                    <span className="w-11 h-11 rounded border border-night-200 text-night-500 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-night-400">Adres</span>
                      <span className="block font-semibold text-night-950 text-sm">
                        {SITE.address}
                      </span>
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ─── Sağ: takvim veya form ─── */}
            <div className="lg:sticky lg:top-28">
              {BOOKING_ENABLED && (
                <div className="mb-6">
                  <h2 className="text-lg font-extrabold text-night-950 mb-1">
                    Takvimden saat seçin
                  </h2>
                  <p className="text-sm text-night-500 mb-4">
                    Uygun bir saat seçin, onay e-postası anında gelsin. Beklemenize gerek yok.
                  </p>
                  <BookingEmbed />
                  <p className="text-center text-sm text-night-500 my-6">
                    veya sizi biz arayalım —
                  </p>
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 md:p-8">
                {status === 'done' ? (
                  <div className="text-center py-8">
                    <span className="w-16 h-16 rounded border border-night-950 text-night-950 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8" />
                    </span>
                    <h2 className="text-2xl font-extrabold text-night-950 mb-3">Talebiniz alındı</h2>
                    <p className="text-night-600 leading-relaxed mb-6">
                      En geç 48 saat içinde <strong className="text-night-950">{phone}</strong>{' '}
                      numarasından size ulaşacağız.
                    </p>

                    <div className="rounded-2xl bg-night-50 p-5 mb-6 text-left">
                      <p className="text-sm text-night-700 leading-relaxed">
                        <strong className="text-night-950">Beklemek istemiyorsanız:</strong>{' '}
                        aşağıdaki düğme sizi bilgileriniz yazılmış hâlde WhatsApp'a götürür.
                        Mesai saatleri içinde genellikle birkaç dakika içinde dönüyoruz.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={waLink(
                          `Merhaba, siteden ücretsiz deneme dersi formunu doldurdum.

` +
                            `Veli: ${name}
` +
                            `Çocuğun yaşı: ${age}
` +
                            `İlgilendiği kurs: ${course || 'Henüz kararsızım'}`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track('whatsapp_tiklandi', { source: 'form_sonrasi' })}
                        className="btn-primary"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp'tan hemen yaz
                      </a>
                      <Link to="/kurslar" className="btn-ghost">
                        Kursları incele
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-extrabold text-night-950 mb-1">
                      Ücretsiz deneme dersi formu
                    </h2>
                    <p className="text-sm text-night-400 mb-6">
                      Yıldızlı alanlar zorunludur. Bilgileriniz üçüncü taraflarla paylaşılmaz.
                    </p>

                    <form
                      name="deneme-dersi"
                      method="POST"
                      data-netlify="true"
                      netlify-honeypot="bot-field"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <input type="hidden" name="form-name" value="deneme-dersi" />
                      <p className="hidden">
                        <label>
                          Bu alanı boş bırakın: <input name="bot-field" />
                        </label>
                      </p>

                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-night-950 mb-1.5"
                        >
                          Veli adı soyadı *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Adınız Soyadınız"
                          className="w-full px-4 py-3 rounded-xl bg-night-50 text-night-950 placeholder:text-night-400 focus:ring-2 focus:ring-brick-500 focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-night-950 mb-1.5"
                        >
                          Telefon numarası *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05XX XXX XX XX"
                          className="w-full px-4 py-3 rounded-xl bg-night-50 text-night-950 placeholder:text-night-400 focus:ring-2 focus:ring-brick-500 focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="age"
                            className="block text-sm font-medium text-night-950 mb-1.5"
                          >
                            Çocuğun yaşı *
                          </label>
                          <select
                            id="age"
                            name="age"
                            required
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-night-50 text-night-950 focus:ring-2 focus:ring-brick-500 focus:bg-white transition-all outline-none"
                          >
                            <option value="">Seçin</option>
                            {AGES.map((a) => (
                              <option key={a} value={a}>
                                {a} yaş
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="course"
                            className="block text-sm font-medium text-night-950 mb-1.5"
                          >
                            İlgilendiği kurs
                          </label>
                          <select
                            id="course"
                            name="course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-night-50 text-night-950 focus:ring-2 focus:ring-brick-500 focus:bg-white transition-all outline-none"
                          >
                            <option value="">Kararsızım</option>
                            {COURSES.map((c) => (
                              <option key={c.id} value={c.shortTitle}>
                                {c.shortTitle}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="note"
                          className="block text-sm font-medium text-night-950 mb-1.5"
                        >
                          Eklemek istediğiniz bir şey var mı?
                        </label>
                        <textarea
                          id="note"
                          name="note"
                          rows={3}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Uygun gün ve saatleriniz, çocuğunuzun daha önceki deneyimi..."
                          className="w-full px-4 py-3 rounded-xl bg-night-50 text-night-950 placeholder:text-night-400 focus:ring-2 focus:ring-brick-500 focus:bg-white transition-all outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!valid || status === 'sending'}
                        className="btn-primary w-full btn-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Gönderiliyor
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Ücretsiz deneme dersi iste
                          </>
                        )}
                      </button>

                      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs text-night-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-night-700" />
                          Kart bilgisi istenmez
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-night-400">
                          <Clock className="w-3.5 h-3.5 text-electric-500" />
                          48 saat içinde dönüş
                        </span>
                      </div>

                      <p className="text-[11px] text-night-400 text-center leading-relaxed pt-1">
                        Formu göndererek{' '}
                        <Link to="/yasal/kvkk" className="underline hover:text-electric-500">
                          KVKK aydınlatma metnini
                        </Link>{' '}
                        okuduğunuzu kabul etmiş olursunuz.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
