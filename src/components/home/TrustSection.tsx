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
      <section id="yorumlar" className="section bg-sand-50 border-t border-sand-300">
        <div className="container">
          <SectionHeading
            index="08"
            eyebrow="Veli Yorumları"
            title="Bizden değil, velilerden dinleyin"
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 70}>
                <figure className="border-t-2 border-ink-950 pt-5 h-full flex flex-col">
                  <Quote className="w-5 h-5 text-brick-500 mb-4" />
                  <blockquote className="text-lead-700 leading-relaxed flex-1">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-sand-300 flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt=""
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full border border-sand-400 flex items-center justify-center text-xs font-semibold text-ink-950">
                        {t.name
                          .split(' ')
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('')}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-semibold text-ink-950">{t.name}</span>
                      <span className="block text-xs text-lead-500">{t.role}</span>
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

  // ─── Yorum yokken: yazılı taahhütler ───────────────────────────────────────
  return (
    <section id="taahhut" className="section bg-sand-50 border-t border-sand-300">
      <div className="container">
        <SectionHeading
          index="08"
          eyebrow="Yazılı Taahhütlerimiz"
          title="Söz vermek kolay. Bunları yazılı veriyoruz."
          subtitle="Aşağıdaki maddelerin her biri sitenin başka bir yerinde de yazılı — yani kontrol edebilirsiniz. Kayıt görüşmesinde ayrıca sözleşmeye geçiyor."
        />

        <ol className="mt-12 grid md:grid-cols-2 gap-x-10 gap-y-0 border-t border-sand-300">
          {COMMITMENTS.map((c, i) => (
            <Reveal as="li" key={c.n} delay={(i % 2) * 60}>
              <div className="py-6 border-b border-sand-300 h-full flex gap-5">
                <span className="font-mono text-xs text-lead-400 pt-1 shrink-0">{c.n}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-950 mb-1.5">
                    {c.title}
                  </h3>
                  <p className="text-lead-600 leading-relaxed text-[15px]">{c.detail}</p>
                  {c.proofTo && (
                    <Link
                      to={c.proofTo}
                      className="mt-2.5 inline-flex items-center gap-1 text-sm font-semibold text-ink-950 border-b border-brick-500 pb-0.5 hover:text-brick-600 transition-colors"
                    >
                      {c.proofLabel}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <p className="text-sm text-lead-500 max-w-2xl">
            Veli yorumlarımızı burada yayınlamıyoruz çünkü izin alınmış gerçek yorum
            biriktirmeyi tercih ediyoruz. Bizimle çalışmış bir aileyle konuşmak isterseniz
            referans görüşmesi ayarlıyoruz — WhatsApp hattımızdan isteyin.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
