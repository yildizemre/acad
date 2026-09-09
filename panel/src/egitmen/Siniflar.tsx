import { Link } from 'react-router-dom';
import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { SinifOzet } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Tablo, tarihSaat } from '../ortak/ui';

export default function Siniflar() {
  // RLS: yalnızca egitmen_id = kendisi olan sınıflar döner.
  const { veri, yukleniyor, hata } = useSorgu<SinifOzet[]>(
    () => sb.from('sinif_ozet').select('*').order('ad'), []);

  return (
    <>
      <Baslik baslik="Sınıflarım" aciklama="Yalnızca size atanan sınıflar görünür" />
      {hata && <Hata metin={hata} />}
      {yukleniyor && <Yukleniyor />}
      {veri && veri.length === 0 && (
        <Bos metin="Size atanmış sınıf yok" ipucu="Yönetim sizi bir sınıfa atadığında burada görünür." />
      )}
      {veri && veri.length > 0 && (
        <Tablo basliklar={['Sınıf', 'Öğrenci', 'Ödev', 'Sonraki ders', '']}>
          {veri.map((s) => (
            <tr key={s.id!} className="hover:bg-night-50">
              <td className="px-5 py-3.5 font-bold text-night-950">{s.ad}</td>
              <td className="px-5 py-3.5 text-night-600">{s.ogrenci_sayisi ?? 0} / {s.kontenjan ?? 0}</td>
              <td className="px-5 py-3.5 text-night-600">{s.odev_sayisi ?? 0}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">{tarihSaat(s.sonraki_ders)}</td>
              <td className="px-5 py-3.5 text-right">
                <Link to={`/egitmen/siniflar/${s.id!}`}
                      className="text-sm font-bold text-night-950 underline decoration-2 underline-offset-4">Aç</Link>
              </td>
            </tr>
          ))}
        </Tablo>
      )}
    </>
  );
}
