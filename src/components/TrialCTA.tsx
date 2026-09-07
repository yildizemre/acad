import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, MessageCircle, Send } from 'lucide-react';
import { COURSES } from '../data/courses';
import { SITE, waLink } from '../data/site';
import { track } from '../lib/analytics';

const AGES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const STEPS = [
  ['01', 'Formu doldurun', '30 saniye sürüyor. Kart bilgisi istemiyoruz.'],
  ['02', 'Sizi arayalım', '48 saat içinde arayıp uygun saati birlikte belirleyelim.'],
  ['03', '1 saatlik gerçek ders', 'Tanıtım sunumu değil; çocuğunuz eğitmenle birlikte kod yazar.'],
  ['04', 'Dürüst geri bildirim', 'Ders sonunda seviyesi ve uygun program hakkında konuşuruz.'],
];

/** Ana sayfanın kapanış bölümü — kısa form, Netlify Forms üzerinden gider. */
export default function TrialCTA() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

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
          note: 'Ana sayfa formu',
        }).toString(),
      });
    } catch {
      // Ağ hatasında bile veliyi WhatsApp'a yönlendiren ekranı gösteriyoruz
    } finally {
      track('form_gonderildi', { yas: age, kurs: course || 'kararsiz', kaynak: 'ana_sayfa' });
      setStatus('done');
    }
  };

  const field =
    'w-full px-4 py-3 rounded bg-white/15 border border-white/30 text-white ' +
    'placeholder:text-white0 focus:border-white focus:outline-none transition-colors';

  return (
    <section id="deneme" className="section">
      <div className="container">
        <div className="rounded-3xl bg-electric-500 text-white p-6 sm:p-8 md:p-12 overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_440px] gap-10 lg:gap-16 items-start [&>*]:min-w-0">
          {/* Sol: süreç */}
          <div>
            <p className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-white/25" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Ücretsiz Deneme Dersi
              </span>
            </p>

            <h2 className="text-display-md text-white mb-6">
              Anlatmakla olmuyor. Bir ders yapalım.
            </h2>

            <p className="text-lg text-white/80 leading-relaxed max-w-xl mb-10">
              Çocuğunuz gerçek bir eğitmenle gerçek bir ders yapar; biz de size seviyesi ve
              hangi programın uygun olduğu hakkında dürüst bir görüş veririz. Bağlayıcılığı yok.
            </p>

            <ol className="border-t border-white/25">
              {STEPS.map(([n, t, d]) => (
                <li key={n} className="flex gap-5 py-5 border-b border-white/25">
                  <span className="font-mono text-xs text-white0 pt-1 shrink-0">{n}</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={waLink('Merhaba, ücretsiz deneme dersi hakkında bilgi almak istiyorum.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_tiklandi', { source: 'ana_sayfa_kapanis' })}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-2 underline-offset-4 decoration-marker hover:text-marker transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp'tan yazmayı tercih ederim
              </a>
              <a
                href={`tel:${SITE.phoneIntl}`}
                onClick={() => track('telefon_tiklandi', { source: 'ana_sayfa_kapanis' })}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                veya arayın: {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Sağ: form */}
          <div className="border border-white/20 rounded-2xl p-6 md:p-8">
            {status === 'done' ? (
              <div className="py-6">
                <h3 className="text-2xl font-extrabold text-white mb-3">
                  Talebiniz alındı
                </h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  48 saat içinde <strong className="text-white">{phone}</strong> numarasından
                  size ulaşacağız. Beklemek istemiyorsanız aşağıdaki düğme sizi bilgileriniz
                  yazılı hâlde WhatsApp'a götürür.
                </p>
                <a
                  href={waLink(
                    `Merhaba, siteden deneme dersi formunu doldurdum.\n\n` +
                      `Veli: ${name}\nÇocuğun yaşı: ${age}\n` +
                      `İlgilendiği kurs: ${course || 'Henüz kararsızım'}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_tiklandi', { source: 'ana_sayfa_form_sonrasi' })}
                  className="btn-primary w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan hemen yaz
                </a>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-extrabold text-white mb-1">
                  Deneme dersi isteyin
                </h3>
                <p className="text-sm text-white/60 mb-6">
                  Yıldızlı alanlar zorunlu. Bilgileriniz üçüncü taraflarla paylaşılmaz.
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
                      Bu alanı boş bırakın: <input name="bot-field" tabIndex={-1} />
                    </label>
                  </p>

                  <div>
                    <label htmlFor="t-name" className="block text-sm text-white/80 mb-1.5">
                      Veli adı soyadı *
                    </label>
                    <input
                      id="t-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className={field}
                    />
                  </div>

                  <div>
                    <label htmlFor="t-phone" className="block text-sm text-white/80 mb-1.5">
                      Telefon *
                    </label>
                    <input
                      id="t-phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className={field}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="t-age" className="block text-sm text-white/80 mb-1.5">
                        Çocuğun yaşı *
                      </label>
                      <select
                        id="t-age"
                        name="age"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className={field}
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
                      <label htmlFor="t-course" className="block text-sm text-white/80 mb-1.5">
                        İlgilendiği kurs
                      </label>
                      <select
                        id="t-course"
                        name="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className={field}
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

                  <button
                    type="submit"
                    disabled={!valid || status === 'sending'}
                    className="btn-brand w-full bg-night-950 hover:bg-night-800 disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gönderiliyor
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Ücretsiz deneme dersi iste
                      </>
                    )}
                  </button>

                  <p className="text-xs text-white0 text-center leading-relaxed">
                    Daha ayrıntılı form için{' '}
                    <Link to="/iletisim" className="text-white/80 underline hover:text-white">
                      iletişim sayfasına
                    </Link>{' '}
                    geçebilirsiniz. Gönderdiğinizde{' '}
                    <Link to="/yasal/kvkk" className="text-white/80 underline hover:text-white">
                      KVKK metnini
                    </Link>{' '}
                    kabul etmiş olursunuz.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Alt şerit */}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-night-500">
          <span>Kart bilgisi istemiyoruz</span>
          <span>Otomatik yenilenen abonelik yok</span>
          <span>İlk 2 ders içinde koşulsuz iade</span>
          <Link to="/fiyatlar" className="text-night-950 hover:text-electric-500 transition-colors">
            Fiyatları gör
            <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
