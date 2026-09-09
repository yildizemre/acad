import { Check } from 'lucide-react';
import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Kayit, Kurs, Ders, DersIlerleme } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Ilerleme, Rozet } from '../ortak/ui';

export default function Kurslarim() {
  const kayitlar = useSorgu<(Kayit & { kurslar: Kurs })[]>(
    () => sb.from('kayitlar').select('*, kurslar!inner(*)') as never,
    [],
  );
  const dersler = useSorgu<Ders[]>(
    () => sb.from('dersler').select('*').eq('yayinda', true).order('sira'),
    [],
  );
  const ilerleme = useSorgu<DersIlerleme[]>(() => sb.from('ders_ilerleme').select('*'), []);

  const bitenler = new Set(
    (ilerleme.veri ?? []).filter((i) => i.tamamlandi).map((i) => i.ders_id),
  );

  return (
    <>
      <Baslik baslik="Kurslarım" aciklama="Müfredat ve ilerlemen" />
      {kayitlar.hata && <Hata metin={kayitlar.hata} />}
      {kayitlar.yukleniyor && <Yukleniyor />}
      {kayitlar.veri?.length === 0 && (
        <Bos metin="Henüz kursunuz yok" ipucu="Kaydınız açıldığında burada görünecek." />
      )}

      <div className="space-y-6">
        {(kayitlar.veri ?? []).map((k) => {
          const kursDersleri = (dersler.veri ?? []).filter((d) => d.kurs_id === k.kurs_id);
          return (
            <section key={k.id} className="kart p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-night-950">{k.kurslar.baslik}</h2>
                  <p className="mt-1 text-sm text-night-500">
                    {k.kurslar.yas_araligi} · {k.kurslar.seviye} · {k.kurslar.hafta_sayisi} hafta
                  </p>
                </div>
                {k.tamamlandi && <Rozet renk="yesil">Tamamlandı</Rozet>}
              </div>

              <div className="mb-5">
                <Ilerleme yuzde={k.ilerleme} />
              </div>

              {kursDersleri.length === 0 && (
                <p className="text-sm text-night-500">Ders içeriği henüz eklenmedi.</p>
              )}

              <ol className="space-y-2">
                {kursDersleri.map((d) => {
                  const bitti = bitenler.has(d.id);
                  return (
                    <li
                      key={d.id}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                        bitti ? 'bg-tint-mint' : 'bg-night-50'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          bitti ? 'bg-night-950 text-white' : 'bg-white text-night-500'
                        }`}
                      >
                        {bitti ? <Check className="h-3 w-3" /> : (d.hafta ?? d.sira)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-night-950">{d.baslik}</span>
                        {d.aciklama && (
                          <span className="block text-xs text-night-500">{d.aciklama}</span>
                        )}
                      </span>
                      {d.hafta && <Rozet>Hafta {d.hafta}</Rozet>}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
