import { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Phone } from 'lucide-react';

const perks = [
  'Tamamen ücretsiz, bağlayıcılığı yok',
  '1 saatlik birebir canlı ders',
  '48 saat içinde sizi arayalım',
];

export default function TrialCTA() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !age) return;

    setSubmitting(true);
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'deneme-dersi',
          name: name.trim(),
          phone: phone.trim(),
          age,
        }).toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="deneme" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-brand-navy rounded-[2.5rem] overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-0 items-center">

            {/* Left: Text */}
            <div className="px-8 md:px-14 py-12 md:py-16">
              <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green-light text-sm font-semibold px-4 py-2 rounded-full mb-7">
                <Sparkles className="w-4 h-4" />
                Sınırlı Kontenjan
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                Ücretsiz Deneme<br />
                <span className="text-gradient">Dersinizi Bugün Alın</span>
              </h2>

              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Çocuğunuzun hangi alanda parladığını birlikte keşfedelim.
                Uzman eğitmenimiz 1 saatlik ücretsiz ders verir, ardından
                en uygun programı önerir.
              </p>

              <ul className="space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-white/80 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Form */}
            <div className="px-8 md:px-14 py-12 md:py-16 lg:border-l border-white/10">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-brand-green" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-2">Kaydınız Alındı!</h3>
                  <p className="text-white/60">
                    48 saat içinde sizi arayacağız. WhatsApp'tan da ulaşabilirsiniz.
                  </p>
                </div>
              ) : (
                <form
                  name="deneme-dersi"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <input type="hidden" name="form-name" value="deneme-dersi" />
                  <p className="hidden" aria-hidden="true">
                    <label>
                      Bot alanı
                      <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>

                  <div>
                    <label htmlFor="trial-name" className="block text-white/70 text-sm font-medium mb-2">
                      Adınız Soyadınız
                    </label>
                    <input
                      id="trial-name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Ayşe Yılmaz"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="trial-phone" className="block text-white/70 text-sm font-medium mb-2">
                      Telefon Numaranız
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        id="trial-phone"
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0 5XX XXX XX XX"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="trial-age" className="block text-white/70 text-sm font-medium mb-2">
                      Çocuğunuzun Yaşı
                    </label>
                    <select
                      id="trial-age"
                      name="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-green transition-colors appearance-none"
                    >
                      <option value="" disabled className="bg-brand-navy text-white/50">
                        Yaş seçin
                      </option>
                      {Array.from({ length: 10 }, (_, i) => i + 8).map((ageOption) => (
                        <option key={ageOption} value={ageOption} className="bg-brand-navy text-white">
                          {ageOption} yaş
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary text-base !py-4 !justify-center mt-2 disabled:opacity-70"
                  >
                    {submitting ? 'Gönderiliyor...' : 'Ücretsiz Ders Rezervasyonu Yap'}
                    {!submitting && <ArrowRight className="w-5 h-5" />}
                  </button>

                  <p className="text-white/40 text-xs text-center leading-relaxed">
                    Kişisel verileriniz KVKK kapsamında korunmaktadır.
                    Spam göndermiyoruz.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
