import { Link } from 'react-router-dom';
import { Video, Megaphone } from 'lucide-react';
import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import { useOturum } from '../giris/Oturum';
import type { Kayit, Kurs, Etkinlik, Duyuru, Odev, OdevTeslimi } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Ilerleme, Rozet, tarihSaat, goreceli } from '../ortak/ui';

export default function Pano() {
  const { profil } = useOturum();

  // RLS: hepsi zaten yalnızca bu öğrenciye ait satırları döndürüyor.
  const kayitlar = useSorgu<(Kayit & { kurslar: Kurs })[]>(
    () => sb.from('kayitlar').select('*, kurslar!inner(*)') as never,
    [],
  );
  const yaklasan = useSorgu<Etkinlik[]>(
    () =>
      sb.from('takvim').select('*').gte('baslangic', new Date().toISOString())
        .order('baslangic').limit(3),
    [],
  );
  const duyurular = useSorgu<Duyuru[]>(
    () =>
      sb.from('duyurular').select('*').eq('yayinda', true)
        .order('olusturuldu', { ascending: false }).limit(3),
    [],
  );
  const odevler = useSorgu<Odev[]>(
    () => sb.from('odevler').select('*').eq('yayinda', true).order('son_tarih'),
    [],
  );
  const teslimler = useSorgu<OdevTeslimi[]>(() => sb.from('odev_teslimleri').select('*'), []);

  const teslimEdilenler = new Set((teslimler.veri ?? []).map((t) => t.odev_id));
  const bekleyenOdev = (odevler.veri ?? []).filter((o) => !teslimEdilenler.has(o.id));

  return (
    <>
      <Baslik baslik={'Merhaba ' + (profil?.ad_soyad ?? '')} aciklama="Bugün ne var?" />

      {kayitlar.hata && <Hata metin={kayitlar.hata} />}
      {kayitlar.yukleniyor && <Yukleniyor />}

      {yaklasan.veri && yaklasan.veri.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-extrabold text-night-950">Yaklaşan dersin</h2>
          <div className="space-y-3">
            {yaklasan.veri.map((e) => (
              <article key={e.id} className="kart flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-night-950">{e.baslik}</h3>
                  <p className="mt-1 text-sm text-night-500">
                    {tarihSaat(e.baslangic)} · {goreceli(e.baslangic)}
                  </p>
                </div>
                {e.zoom_url && (
                  <a href={e.zoom_url} target="_blank" rel="noopener noreferrer" className="btn-ana">
                    <Video className="h-4 w-4" />
                    Derse katıl
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {bekleyenOdev.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-extrabold text-night-950">
            Bekleyen ödevin ({bekleyenOdev.length})
          </h2>
          <div className="space-y-3">
            {bekleyenOdev.slice(0, 3).map((o) => (
              <article key={o.id} className="kart flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-night-950">{o.baslik}</h3>
                  {o.son_tarih && (
                    <p className="mt-1 text-sm text-night-500">
                      Son teslim: {tarihSaat(o.son_tarih)} · {goreceli(o.son_tarih)}
                    </p>
                  )}
                </div>
                <Link to="/ogrenci/odevlerim" className="btn-ikinci">
                  Teslim et
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-extrabold text-night-950">Kurslarım</h2>
        {kayitlar.veri?.length === 0 && (
          <Bos metin="Henüz kursunuz yok" ipucu="Kaydınız açıldığında burada görünecek." />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {(kayitlar.veri ?? []).map((k) => (
            <article key={k.id} className="kart p-5">
              <h3 className="mb-1 font-extrabold text-night-950">{k.kurslar.baslik}</h3>
              <p className="mb-4 text-sm text-night-500">
                {k.kurslar.hafta_sayisi} hafta · {k.kurslar.seviye}
              </p>
              <Ilerleme yuzde={k.ilerleme} />
            </article>
          ))}
        </div>
      </section>

      {duyurular.veri && duyurular.veri.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-night-950">Duyurular</h2>
          <div className="space-y-3">
            {duyurular.veri.map((d) => (
              <article key={d.id} className="kart p-5">
                <div className="mb-2 flex items-center gap-2.5">
                  <Megaphone className="h-4 w-4 text-night-400" />
                  <h3 className="font-extrabold text-night-950">{d.baslik}</h3>
                  {d.onemli && <Rozet renk="kirmizi">Önemli</Rozet>}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-night-600">
                  {d.icerik}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
