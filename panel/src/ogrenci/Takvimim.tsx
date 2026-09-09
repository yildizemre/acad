import { Video } from 'lucide-react';
import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Etkinlik } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Rozet, tarihSaat, goreceli, saat } from '../ortak/ui';

const TUR_ADI: Record<string, string> = {
  canli_ders: 'Canlı ders',
  sinav: 'Sınav',
  odev_teslim: 'Ödev teslimi',
  demo_gunu: 'Demo Günü',
  diger: 'Etkinlik',
};

export default function Takvimim() {
  // RLS: yalnızca öğrencinin sınıfına/kursuna ait etkinlikler döner.
  const { veri, yukleniyor, hata } = useSorgu<Etkinlik[]>(
    () => sb.from('takvim').select('*').order('baslangic'),
    [],
  );

  const simdi = Date.now();
  const gelecek = (veri ?? []).filter((e) => new Date(e.baslangic).getTime() >= simdi);
  const gecmis = (veri ?? []).filter((e) => new Date(e.baslangic).getTime() < simdi).reverse();

  return (
    <>
      <Baslik baslik="Takvimim" aciklama="Derslerin ve etkinliklerin" />
      {hata && <Hata metin={hata} />}
      {yukleniyor && <Yukleniyor />}

      <h2 className="mb-4 text-lg font-extrabold text-night-950">Yaklaşan ({gelecek.length})</h2>
      {gelecek.length === 0 && !yukleniyor && (
        <Bos metin="Yaklaşan ders yok" ipucu="Eğitmenin ders programını eklediğinde burada görünecek." />
      )}

      <div className="mb-8 space-y-3">
        {gelecek.map((e) => (
          <article key={e.id} className="kart flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <h3 className="font-extrabold text-night-950">{e.baslik}</h3>
                <Rozet renk="mavi">{TUR_ADI[e.tur] ?? e.tur}</Rozet>
              </div>
              <p className="text-sm text-night-500">
                {tarihSaat(e.baslangic)} – {saat(e.bitis)} · {goreceli(e.baslangic)}
              </p>
            </div>
            {e.zoom_url && (
              <a href={e.zoom_url} target="_blank" rel="noopener noreferrer" className="btn-ana">
                <Video className="h-4 w-4" />
                Katıl
              </a>
            )}
          </article>
        ))}
      </div>

      {gecmis.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-extrabold text-night-950">Geçmiş dersler</h2>
          <div className="space-y-2">
            {gecmis.slice(0, 15).map((e) => (
              <article key={e.id} className="kart flex flex-wrap items-center gap-3 p-4 opacity-70">
                <span className="font-bold text-night-950">{e.baslik}</span>
                <span className="ml-auto text-sm text-night-500">{tarihSaat(e.baslangic)}</span>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
