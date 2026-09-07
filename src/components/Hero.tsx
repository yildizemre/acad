import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { STATS, TRUST_POINTS, SITE } from '../data/site';
import { courseById } from '../data/courses';

/** İstatistik rakamlarının arkasındaki renk — sırayla döner. */
const NUM_TINT = ['bg-marker', 'bg-tint-sky', 'bg-tint-rose', 'bg-tint-peach'];

/** Ders ekranının üstünde duran rozetler. */
const BADGES = [
  { icon: Users, text: 'En fazla 8 kişi', pos: 'top-5 -left-3 md:-left-8', tint: 'bg-electric-500 text-white' },
  { icon: Clock, text: 'Haftada 2 canlı ders', pos: 'top-1/3 -right-3 md:-right-8', tint: 'bg-marker text-night-950' },
  { icon: Sparkles, text: 'Her ders kaydediliyor', pos: 'bottom-16 -left-3 md:-left-10', tint: 'bg-tint-rose text-night-950' },
  { icon: ShieldCheck, text: 'İlk 2 ders koşulsuz iade', pos: 'bottom-4 right-2 md:-right-6', tint: 'bg-night-950 text-white' },
];

export default function Hero() {
  const ornek = courseById('scratch');

  return (
    <section className="overflow-hidden">
      <div className="container">
        {/* ─── Başlık ─── */}
        <div className="pt-12 md:pt-20 pb-10 md:pb-14 text-center max-w-4xl mx-auto animate-fade-in-up">
          <p className="eyebrow justify-center mb-6">
            {SITE.foundedYear}&apos;den beri &middot; {SITE.parentInstitution} bünyesinde
          </p>

          <h1 className="text-display-lg mb-7">
            Çocuğunuz ekranın <span className="mark">üretici</span> tarafına geçsin
          </h1>

          <p className="text-lg md:text-xl text-night-600 leading-relaxed max-w-2xl mx-auto mb-9">
            8–17 yaş için canlı online yazılım, robotik ve yapay zeka programları.
            Müfredat hafta hafta açık, fiyatlar sitede yazılı, ilk ders ücretsiz.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/iletisim" className="btn-primary btn-lg">
              Ücretsiz deneme dersi al
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/kurslar" className="btn-ghost btn-lg">
              Müfredatları incele
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {TRUST_POINTS.map((t) => (
              <li key={t} className="text-sm font-semibold text-night-500">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Ders ekranı + uçuşan rozetler ─── */}
      <div className="container">
        <figure className="relative max-w-5xl mx-auto animate-fade-in-up animate-delay-200">
          <div className="rounded-3xl overflow-hidden bg-night-950 p-2 md:p-3 shadow-lift">
            <img
              src="/images/kurs-scratch.svg"
              alt="Hype Academia canlı ders ekranı: Scratch arayüzünde blok kodlama, sağda eğitmen ve öğrenci kutucukları"
              width={1200}
              height={800}
              decoding="async"
              className="w-full block rounded-2xl"
            />
          </div>

          {BADGES.map((b, i) => (
            <span
              key={b.text}
              style={{ animationDelay: `${i * 700}ms` }}
              className={`hidden sm:inline-flex items-center gap-2 absolute ${b.pos} ${b.tint}
                          px-4 py-2.5 rounded-full text-sm font-bold shadow-lift animate-float`}
            >
              <b.icon className="w-4 h-4" />
              {b.text}
            </span>
          ))}

          <figcaption className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-night-500">
            <span>
              Scratch dersinin 3. haftasından gerçek bir ekran — dersler Zoom veya Google Meet
              üzerinden canlı işlenir.
            </span>
            {ornek && (
              <Link
                to={`/kurslar/${ornek.slug}`}
                className="font-bold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500"
              >
                Bu kursun müfredatı
              </Link>
            )}
          </figcaption>
        </figure>
      </div>

      {/* ─── Rakamlar — her biri renkli kutu içinde ─── */}
      <div className="container">
        <dl className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center">
              <dd
                className={`mark-num text-3xl md:text-4xl font-extrabold text-night-950 ${
                  NUM_TINT[i % NUM_TINT.length]
                }`}
              >
                {s.value}
              </dd>
              <dt className="mt-3 font-bold text-night-900 text-sm">{s.label}</dt>
              {s.note && <p className="text-xs text-night-500 mt-1 leading-snug">{s.note}</p>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
