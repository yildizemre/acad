import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { TEACHERS } from '../../data/content';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

/**
 * Eğitmenler ancak DOĞRULANABİLİR olduklarında ana sayfaya çıkar.
 *
 * "Müh. Ahmet K." gibi baş harfli bir isim ana sayfada güven vermez, tam tersini
 * yapar. Bu yüzden bölüm yalnızca en az bir eğitmenin fotoğrafı veya mesleki
 * profil bağlantısı girildiğinde görünür. Veri girildiği an kendiliğinden açılır;
 * bkz. src/data/content.ts → TEACHERS.
 */
export default function TeachersTeaser() {
  const verifiable = TEACHERS.filter((t) => t.photo || t.profile);
  if (verifiable.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            index="04"
            eyebrow="Eğitmenler"
            title="Dersi kim veriyor?"
            subtitle="Eğitmenlerimiz aktif olarak sektörde çalışan mühendisler. Anlattıkları şeyi kendileri yapıyor."
          />
          <Link to="/hakkimizda#egitmenler" className="btn-ghost shrink-0">
            Tüm kadro
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {verifiable.slice(0, 3).map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <article className="border-t-2 border-night-950 pt-5 h-full">
                <div className="flex items-center gap-3 mb-4">
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={`${t.name} — ${t.title}`}
                      loading="lazy"
                      decoding="async"
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-14 h-14 rounded bg-night-950 text-white flex items-center justify-center font-semibold shrink-0">
                      {t.initials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold text-night-950">{t.name}</h3>
                    <p className="text-xs text-electric-500 font-semibold">{t.title}</p>
                  </div>
                </div>

                <p className="text-sm text-night-600 leading-relaxed mb-3">{t.exp}</p>
                <p className="text-xs text-night-500 mb-3">
                  Verdiği kurslar: <span className="text-night-950">{t.courses}</span>
                </p>

                {t.profile && (
                  <a
                    href={t.profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500 transition-colors"
                  >
                    Mesleki profili
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
