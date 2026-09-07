import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { STATS, TRUST_POINTS, SITE } from '../data/site';

export default function Hero() {
  return (
    <section className="border-b border-sand-300">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 py-14 md:py-20 items-end">
          {/* Metin: 7 sütun */}
          <div className="lg:col-span-7 animate-fade-in-up">
            <p className="eyebrow mb-7">
              <span className="rule" />
              {SITE.foundedYear}&apos;den beri &middot; {SITE.parentInstitution}
            </p>

            <h1 className="font-display text-display-lg font-semibold text-ink-950 mb-7">
              Çocuğunuz ekranın <span className="underline-electric">üretici</span> tarafına geçsin.
            </h1>

            <p className="text-lead-700 text-lg md:text-xl leading-relaxed max-w-xl mb-9">
              8–17 yaş için canlı online yazılım, robotik ve yapay zeka programları. Müfredat
              hafta hafta açık, fiyatlar sitede yazılı, ilk ders ücretsiz.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/iletisim" className="btn-primary btn-lg">
                Ücretsiz deneme dersi al
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/kurslar" className="btn-ghost btn-lg">
                Müfredatları incele
              </Link>
            </div>

            {/* Güven noktaları — ikon kutucuğu yok, çizgi var */}
            <ul className="border-t border-sand-300 divide-y divide-sand-300 max-w-xl">
              {TRUST_POINTS.map((item) => (
                <li key={item} className="flex items-baseline gap-3 py-2.5 text-sm text-lead-700">
                  <span className="text-electric-500 font-mono text-xs shrink-0">&mdash;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Görsel: 5 sütun. Üstünde hiçbir rozet yüzmüyor. */}
          <div className="lg:col-span-5 animate-fade-in-up animate-delay-200">
            <div className="aspect-[4/5] overflow-hidden rounded-lg border border-sand-300 bg-sand-200">
              <img
                src="/images/p4145153-900.jpg"
                alt="Öğrenci canlı online derste eğitmeniyle birlikte kod yazıyor"
                width={900}
                height={601}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs text-lead-500 leading-relaxed">
              Dersler Zoom veya Google Meet üzerinden canlı yapılır, kaydedilir ve 12 ay boyunca
              öğrenci panelinde kalır.
            </p>
          </div>
        </div>
      </div>

      {/* İstatistik şeridi — çizgilerle bölünmüş, kutucuksuz */}
      <div className="border-t border-sand-300 bg-sand-50">
        <div className="container">
          <dl className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-sand-300">
            {STATS.map((s) => (
              <div key={s.label} className="py-7 md:py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                <dd className="font-display text-3xl font-semibold text-ink-950 leading-none">
                  {s.value}
                </dd>
                <dt className="text-sm text-lead-500 mt-2">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
