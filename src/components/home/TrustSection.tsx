import { Link } from 'react-router-dom';
import { ArrowUpRight, Quote } from 'lucide-react';
import { TESTIMONIALS, HAS_TESTIMONIALS, COMMITMENTS } from '../../data/testimonials';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

/**
 * Gerçek veli yorumu girildiğinde yorumları gösterir; girilmediğinde
 * doğrulanabilir yazılı taahhütleri gösterir.
 *
 * Uydurma yorum koymak yerine bu yol seçildi: her madde sitenin başka bir
 * yerinde de yazılı olduğu için veli kontrol edebiliyor.
 */
export default function TrustSection() {
  if (HAS_TESTIMONIALS) {
    return (
      <section id="yorumlar" className="section bg-white">
        <div className="container">
          <SectionHeading
            index="07"
            eyebrow="Veli Yorumları"
            title="Bizden değil, velilerden dinleyin"
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 70}>
                <figure className="border-t-2 border-night-950 pt-5 h-full flex flex-col">
                  <Quote className="w-5 h-5 text-electric-500 mb-4" />
                  <blockquote className="text-night-700 leading-relaxed flex-1">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 pt-4 flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt=""
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full border border-night-200 flex items-center justify-center text-xs font-semibold text-night-950">
                        {t.name
                          .split(' ')
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('')}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-semibold text-night-950">{t.name}</span>
                      <span className="block text-xs text-night-500">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── Yorum yokken: yazılı taahhütler ───────────────────────────────────
  const TINTS = [
    'bg-tint-peach', 'bg-tint-sky', 'bg-tint-lime', 'bg-tint-rose',
    'bg-tint-lilac', 'bg-tint-mint', 'bg-tint-sand', 'bg-night-50',
  ];

  return (
    <section id="taahhut" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Yazılı Taahhütlerimiz"
          title={
            <>
              Söz vermek kolay. Bunları <span className="mark">yazılı veriyoruz</span>
            </>
          }
          subtitle="Aşağıdaki maddelerin her biri sitenin başka bir yerinde de yazılı — yani kontrol edebilirsiniz. Kayıt görüşmesinde ayrıca sözleşmeye geçiyor."
        />

        <ol className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {COMMITMENTS.map((c, i) => (
            <Reveal as="li" key={c.n} delay={(i % 4) * 60}>
              <div className={`rounded-3xl p-6 h-full flex flex-col ${TINTS[i % TINTS.length]}`}>
                <span className="w-10 h-10 rounded-full bg-night-950 text-white flex items-center justify-center text-sm font-extrabold mb-4">
                  {c.n}
                </span>
                <h3 className="text-lg font-extrabold text-night-950 mb-2 leading-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-night-700 leading-relaxed">{c.detail}</p>
                {c.proofTo && (
                  <Link
                    to={c.proofTo}
                    className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500 transition-colors"
                  >
                    {c.proofLabel}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <p className="text-center text-night-500 max-w-2xl mx-auto">
            Veli yorumlarımızı burada yayınlamıyoruz çünkü izin alınmış gerçek yorum
            biriktirmeyi tercih ediyoruz. Bizimle çalışmış bir aileyle konuşmak isterseniz
            referans görüşmesi ayarlıyoruz — WhatsApp hattımızdan isteyin.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
