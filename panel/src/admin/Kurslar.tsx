import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Kurs } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Tablo, Rozet } from '../ortak/ui';

/**
 * Kurs listesi.
 *
 * Kurslar şu an pazarlama sitesindeki müfredatla aynı; buradan yalnızca
 * görüntüleniyor. Kurs oluşturma/düzenleme sonraki adımda eklenecek.
 */
export default function Kurslar() {
  const { veri, yukleniyor, hata } = useSorgu<Kurs[]>(
    () => sb.from('kurslar').select('*').order('baslik'),
    [],
  );

  return (
    <>
      <Baslik baslik="Kurslar" aciklama="Program ve müfredat" />
      {hata && <Hata metin={hata} />}
      {yukleniyor && <Yukleniyor />}
      {veri && veri.length === 0 && <Bos metin="Henüz kurs yok" />}
      {veri && veri.length > 0 && (
        <Tablo basliklar={['Kurs', 'Yaş', 'Seviye', 'Süre', 'Durum']}>
          {veri.map((k) => (
            <tr key={k.id}>
              <td className="px-5 py-3.5">
                <span className="font-bold text-night-950">{k.baslik}</span>
                {k.aciklama && (
                  <span className="block max-w-md text-xs text-night-500">{k.aciklama}</span>
                )}
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">{k.yas_araligi ?? '—'}</td>
              <td className="px-5 py-3.5 text-night-600">{k.seviye ?? '—'}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">
                {k.hafta_sayisi} hafta · {k.hafta_sayisi * k.haftalik_ders} ders
              </td>
              <td className="px-5 py-3.5">
                <Rozet renk={k.durum === 'yayinda' ? 'yesil' : 'notr'}>
                  {k.durum === 'yayinda' ? 'Yayında' : k.durum === 'taslak' ? 'Taslak' : 'Arşiv'}
                </Rozet>
              </td>
            </tr>
          ))}
        </Tablo>
      )}
    </>
  );
}
